from typing import Dict, Any, List
from google import genai
from google.genai import types
import json
import re
import logging
import time
from datetime import datetime
from app.schemas.chat import Message
from app.core.config import settings
from app.services.prompts import get_structured_prompt, get_simple_prompt, is_simple_query
from app.services.knowledge_service import build_travel_context, format_context_for_prompt

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Models to try in order — optimized for speed and reliability
MODELS = [
    "models/gemini-2.0-flash-lite", 
    "models/gemini-flash-latest",
    "models/gemini-2.0-flash",
    "models/gemini-2.5-flash",
    "models/gemini-flash-lite-latest",
    "models/gemini-3.1-flash-lite-preview",
]


class ChatService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.client = None
        if self.api_key:
            try:
                self.client = genai.Client(api_key=self.api_key)
                logger.info("Gemini client initialized (google-genai SDK)")
            except Exception as e:
                logger.error(f"Failed to init Gemini client: {e}")
        else:
            logger.warning("GEMINI_API_KEY not set. Running in simulation mode.")

    def _detect_language(self, text: str) -> str:
        """Detect language from user input."""
        text_lower = text.lower()
        if "hindi" in text_lower: return 'hi'
        if "gujarati" in text_lower or "gujrati" in text_lower: return 'gu'
        if re.search(r'[\u0a80-\u0aff]', text): return 'gu'
        if re.search(r'[\u0900-\u097f]', text): return 'hi'
        return 'en'

    async def active_chat_processing(
        self, user_input: str, history: List[Message], db=None, specific_lang: str = None
    ) -> Dict[str, Any]:
        if not self.client:
            return self._error_response("no_key")

        start_time = time.time()
        try:
            applied_lang = specific_lang if specific_lang in ['en', 'hi', 'gu'] else self._detect_language(user_input)
            lang = applied_lang
            simple = is_simple_query(user_input)

            if simple:
                system_prompt = get_simple_prompt(lang)
                kb_context = ""
            else:
                system_prompt = get_structured_prompt(lang)
                kb_context = ""
                if db is not None:
                    try:
                        ctx = await build_travel_context(db, user_input)
                        kb_context = format_context_for_prompt(ctx)
                    except Exception as kb_err:
                        logger.warning(f"KB context error: {kb_err}")

            history_text = ""
            if history:
                history_text = "\n\nCONVERSATION HISTORY (last 6 exchanges):\n"
                for msg in history[-6:]:
                    role = "User" if msg.role == "user" else "Assistant"
                    content = msg.content
                    if role == "Assistant" and len(content) > 300:
                        content = content[:300] + "..."
                    history_text += f"{role}: {content}\n"

            today = datetime.now().strftime("%d %B %Y, %I:%M %p")
            prompt_header = f"CURRENT DATE/TIME: {today}\nLOCATION CONTEXT: India\n"
            
            full_prompt = f"{prompt_header}\n{system_prompt}\n\n{kb_context}{history_text}\n\nUser: {user_input}\nAssistant:"

            gen_config = {"temperature": 0.7, "top_p": 0.95, "max_output_tokens": 4096}
            response_text = None
            
            for model_name in MODELS:
                try:
                    logger.info(f">>> GEMINI REQUEST [{model_name}]")
                    response = await self.client.aio.models.generate_content(
                        model=model_name, contents=full_prompt,
                        config=types.GenerateContentConfig(**gen_config)
                    )
                    if not response: continue
                    if hasattr(response, 'text') and response.text:
                        response_text = response.text.strip()
                    elif hasattr(response, 'candidates') and len(response.candidates) > 0:
                        candidate = response.candidates[0]
                        if hasattr(candidate, 'content') and hasattr(candidate.content, 'parts'):
                            response_text = candidate.content.parts[0].text.strip()
                    
                    if response_text:
                        logger.info(f"Gemini SUCCESS ({model_name}): {len(response_text)} chars")
                        break

                except Exception as e:
                    err_msg = str(e)
                    logger.error(f"GEMINI ERROR [{model_name}]: {type(e).__name__} - {err_msg}")
                    
                    # If quota is exhausted for ONE model, it might still exist for another
                    # So we don't return immediately here, we let the loop continue
                    if "429" in err_msg or "RESOURCE_EXHAUSTED" in err_msg or "quota" in err_msg.lower():
                        continue 
                    
                    continue

            if response_text is None:
                # ── LAST RESORT: LOCAL DATABASE FALLBACK / SIMULATION ──
                # If ALL models have hit quota, we use local intelligence
                if db is not None:
                    try:
                        # 1. Detection of Places
                        potential_place = re.search(r'\b(Chandigarh|Delhi|Mumbai|Goa|Kerala|Jaipur|Agra|Shimla|Manali|Udaipur|Varanasi)\b', user_input, re.I)
                        
                        # 2. Handle generic "Aur bhi" or "Suggest something"
                        if not potential_place and any(k in user_input.lower() for k in ["aur bhi", "suggest", "top", "list", "explore"]):
                            # Suggest top 3 randomly from DB
                            cursor = db.trips.find().limit(20)
                            all_places = await cursor.to_list(length=20)
                            import random
                            choices = random.sample(all_places, k=min(3, len(all_places)))
                            msg = "AI abhi break le raha hai, par main aapke liye kuch behtareen places suggest kar sakta hoon! 📍\n\n"
                            for c in choices:
                                msg += f"🇮🇳 *{c.get('name')}*: {c.get('highlights', 'Beautiful destination')}\n"
                            msg += "\nInmein se aapko kya pasand aaya?"
                            return self._text_response(msg, lang)

                        # 3. Handle specific place info
                        if potential_place:
                            p_name = potential_place.group(0).title()
                            place_info = await db.trips.find_one({"name": {"$regex": p_name, "$options": "i"}})
                            if place_info:
                                msg = f"Mere paas {p_name} ki special jaankari hai! 😊\n\n"
                                msg += f"✨ Highlights: {place_info.get('highlights', 'Amazing site')}\n"
                                msg += f"📅 Best time: {place_info.get('best_time', 'September to March')}\n"
                                msg += f"💡 Tip: {place_info.get('tips', 'Carry comfortable shoes!')}\n\n"
                                msg += "AI connection restore hote hi main aapka full plan bana doonga. Tab tak, kya iski detail doon?"
                                return self._text_response(msg, lang)
                    except Exception as fallback_err:
                        logger.error(f"Simulation Error: {fallback_err}")
                
                return self._error_response("quota")

            # Parse JSON if possible
            parsed = self._extract_json(response_text)

            # Log analytics
            latency_ms = int((time.time() - start_time) * 1000)
            await self._log_analytics_event(db, user_input, parsed or response_text, history, latency_ms)

            if parsed and isinstance(parsed, dict):
                if 'lang' not in parsed or not parsed['lang']:
                    parsed['lang'] = lang
                parsed.setdefault('reply', 'Namaste!')
                parsed.setdefault('itinerary', [])
                parsed.setdefault('nearby_hotels', [])
                parsed.setdefault('nearby_food', [])
                parsed.setdefault('famous_food_items', [])
                return parsed

            # Check if it looks like JSON but parse failed (to prevent double-wrapping)
            if response_text.lstrip().startswith('{') or '{"' in response_text or '```' in response_text:
                # One last cleanup attempt
                cleaned = re.sub(r'```(?:json)?\s*([\s\S]*?)\s*```', r'\1', response_text).strip()
                try:
                    p = json.loads(cleaned)
                    if isinstance(p, dict): return p
                except:
                    # Final attempt: find first { and last }
                    try:
                        f = cleaned.find('{')
                        l = cleaned.rfind('}')
                        if f != -1 and l != -1:
                            p = json.loads(cleaned[f:l+1])
                            if isinstance(p, dict): return p
                    except: pass

            return self._text_response(response_text, lang)

        except Exception as e:
            logger.error(f"ChatService error: {e}")
            return self._error_response("general")

    def _extract_json(self, text: str) -> Dict[str, Any]:
        if not text: return None
        text = text.strip()

        # Try to find JSON in markdown blocks first
        match = re.search(r'```(?:json)?\s*([\s\S]*?)\s*```', text, re.DOTALL)
        if match:
            res = self._try_parse(match.group(1).strip())
            if res: return res

        # Try to find JSON by braces
        brace_match = re.search(r'\{[\s\S]*\}', text, re.DOTALL)
        if brace_match:
            res = self._try_parse(brace_match.group(0))
            if res: return res

        return self._try_parse(text)

    def _try_parse(self, text: str) -> Dict[str, Any]:
        if not text: return None
        try:
            val = json.loads(text)
            return val if isinstance(val, dict) else None
        except:
            try:
                # More aggressive sanitization for common AI JSON errors
                sanitized = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]', '', text)
                sanitized = re.sub(r',(\s*[}\]])', r'\1', sanitized) # Remove trailing commas
                # Replace literal newlines with spaces to avoid JSON string parse errors
                sanitized = sanitized.replace('\n', ' ')
                val = json.loads(sanitized)
                return val if isinstance(val, dict) else None
            except:
                return None

    def _text_response(self, text: str, lang: str = 'en') -> Dict[str, Any]:
        return {
            "reply": text, "lang": lang, "intent_type": "chat", "route_summary": None, "itinerary": [],
            "nearby_hotels": [], "nearby_food": [], "famous_food_items": [], "budget_summary": None,
            "flight_options": [], "train_options": [], "bus_options": []
        }

    def _error_response(self, error_type: str = "general") -> Dict[str, Any]:
        if error_type == "quota":
            msg = "Bataiye toh sahi! 😄 Log kaafi travel plans pooch rahe hain. AI thoda break le raha hai. Main 5 min mein aata hoon!"
        elif error_type == "no_key":
            msg = "Ops! Gemini API key nahi mil rahi."
        else:
            msg = "Swagat hai! 😄 Abhi server busy hai, par main aapke liye general travel advice de sakta hoon. Aap kahan ghumna chahte ho?"
        return {
            "reply": msg, "lang": "hi", "intent_type": "error", "route_summary": None,
            "itinerary": [], "nearby_hotels": [], "nearby_food": [],
            "famous_food_items": [], "budget_summary": None,
            "flight_options": [], "train_options": [], "bus_options": []
        }


    async def _log_analytics_event(self, db, user_input: str, response: Any, history: List[Message], latency_ms: int):
        """Log rich analytics for the dashboard."""
        if db is None: return

        try:
            # Detect entities from user input (naive extraction for analytics)
            # This can be improved by using NLP processor, but for now we look at the AI response
            # which usually has structured data if successful.
            
            intent = "unknown"
            place = None
            budget = None
            mode = None
            status = "success"

            if isinstance(response, dict):
                intent = response.get("intent_type", "discovery")
                
                # Extract place from route_summary
                rs = response.get("route_summary")
                if rs:
                    place = rs.get("to") or rs.get("destination")
                
                # Extract budget category
                bs = response.get("budget_summary")
                if bs:
                    budget = bs.get("category")
                
                # Extract best travel mode
                if rs:
                    mode_str = (rs.get("best_mode") or rs.get("recommended_travel_mode") or "").lower()
                    if "flight" in mode_str: mode = "Flight"
                    elif "train" in mode_str: mode = "Train"
                    elif "bus" in mode_str: mode = "Bus"
                    elif "taxi" in mode_str or "cab" in mode_str: mode = "Taxi"

            # If No intent found in response, try to infer from user_input
            if intent == "unknown":
                text = user_input.lower()
                if any(k in text for k in ["budget", "kharcha", "cost", "price"]): intent = "budget"
                elif any(k in text for k in ["train", "flight", "bus", "taxi", "route"]): intent = "transport"
                elif any(k in text for k in ["hotel", "stay", "ruke"]): intent = "hotels"
                elif any(k in text for k in ["food", "khana", "restaurant"]): intent = "food"
                elif any(k in text for k in ["place", "famous", "visit", "see"]): intent = "places"

            # Log to DB
            await db.analytics.insert_one({
                "query": user_input,
                "intent": intent,
                "place": place,
                "budget": budget,
                "transport_mode": mode,
                "latency_ms": latency_ms,
                "status": status,
                "timestamp": datetime.now().isoformat()
            })
            
            # Also update trending collection for faster top-N queries
            if place:
                await db.trending_places.update_one(
                    {"place": place},
                    {"$inc": {"count": 1}, "$set": {"last_searched": datetime.now().isoformat()}},
                    upsert=True
                )

        except Exception as e:
            logger.error(f"Analytics logging error: {e}")

chat_service = ChatService()

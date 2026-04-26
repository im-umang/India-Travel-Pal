import asyncio
import re
import random
from motor.motor_asyncio import AsyncIOMotorClient

async def test_fallback():
    # Simulate DB connection
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client.india_travel_pal
    
    user_input = "Aur bhi cheez dikhao"
    lang = "hi"
    
    print(f"User Input: {user_input}")
    
    # ── FALLBACK LOGIC SIMULATION ──
    try:
        # 1. Detection of Places
        potential_place = re.search(r'\b(Chandigarh|Delhi|Mumbai|Goa|Kerala|Jaipur|Agra|Shimla|Manali|Udaipur|Varanasi)\b', user_input, re.I)
        
        # 2. Handle generic "Aur bhi" or "Suggest something"
        if not potential_place and any(k in user_input.lower() for k in ["aur bhi", "suggest", "top", "list", "explore"]):
            # Suggest top 3 randomly from DB
            cursor = db.trips.find().limit(20)
            all_places = await cursor.to_list(length=20)
            choices = random.sample(all_places, k=min(3, len(all_places)))
            msg = "AI abhi break le raha hai, par main aapke liye kuch behtareen places suggest kar sakta hoon! 📍\n\n"
            for c in choices:
                msg += f"🇮🇳 *{c.get('name')}*: {c.get('highlights', 'Beautiful destination')}\n"
            msg += "\nInmein se aapko kya pasand aaya?"
            print(f"\n--- FALLBACK RESPONSE ---\n{msg}")
            return
        else:
            print("No fallback triggered for this input")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_fallback())

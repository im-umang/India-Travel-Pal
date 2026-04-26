"""
REST API Routes for India Travel Pal Chatbot
Endpoints: /chat, /health, /model-info, /destinations, /train-model
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional

from app.models.intent_classifier import IntentClassifier
from app.models.nlp_processor import NLPProcessor
from app.services.travel_planner import TravelPlanner
from app.data.destinations import DESTINATIONS

# ── Initialize AI components ──
intent_classifier = IntentClassifier()
nlp_processor = NLPProcessor()
travel_planner = TravelPlanner()

router = APIRouter()


# ── Request / Response Models ──

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=1000, description="User message")
    session_id: Optional[str] = Field(None, description="Optional session ID for context")

class ChatResponse(BaseModel):
    reply: str
    intent: str
    confidence: float
    entities: dict
    session_id: Optional[str] = None

class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str

class AuthResponse(BaseModel):
    success: bool
    user: Optional[dict] = None
    token: Optional[str] = None
    error: Optional[str] = None


# ── Chat Endpoint (Main AI endpoint) ──

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Main chat endpoint — processes user message through AI pipeline:
    1. Intent classification (ML model)
    2. Entity extraction (NLP)
    3. Response generation (Travel planner)
    """
    message = request.message.strip()

    if not message:
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    # Step 1: Classify intent using trained ML model
    intent_result = intent_classifier.predict(message)

    # Step 2: Extract entities (destinations, days, budget, etc.)
    entities = nlp_processor.extract_entities(message)

    # Step 3: Generate intelligent response
    reply = travel_planner.generate_response(
        intent=intent_result["intent"],
        entities=entities,
    )

    return ChatResponse(
        reply=reply,
        intent=intent_result["intent"],
        confidence=intent_result["confidence"],
        entities=entities,
        session_id=request.session_id,
    )


# ── Auth Endpoints (Mock — for frontend compatibility) ──

@router.post("/auth/login", response_model=AuthResponse)
async def login(request: LoginRequest):
    """Mock login endpoint."""
    if not request.email or not request.password:
        return AuthResponse(success=False, error="Email and password are required")

    if len(request.password) < 6:
        return AuthResponse(success=False, error="Invalid credentials")

    # Mock successful login
    return AuthResponse(
        success=True,
        user={
            "id": "user_1",
            "name": request.email.split("@")[0].title(),
            "email": request.email,
        },
        token="mock_jwt_token_" + request.email.replace("@", "_"),
    )


@router.post("/auth/register", response_model=AuthResponse)
async def register(request: RegisterRequest):
    """Mock register endpoint."""
    if not request.name or not request.email or not request.password:
        return AuthResponse(success=False, error="All fields are required")

    if len(request.password) < 6:
        return AuthResponse(success=False, error="Password must be at least 6 characters")

    return AuthResponse(
        success=True,
        user={
            "id": "user_new",
            "name": request.name,
            "email": request.email,
        },
        token="mock_jwt_token_" + request.email.replace("@", "_"),
    )


# ── Info Endpoints ──

@router.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "India Travel Pal — AI Backend",
        "model_loaded": intent_classifier.is_trained,
    }


@router.get("/model-info")
async def model_info():
    """Returns ML model metadata."""
    return intent_classifier.get_model_info()


@router.get("/destinations")
async def list_destinations():
    """List all available destinations."""
    return {
        name: {
            "name": data["name"],
            "city": data["city"],
            "state": data["state"],
            "type": data["type"],
            "best_time": data["best_time"],
        }
        for name, data in DESTINATIONS.items()
    }


@router.get("/destinations/{dest_key}")
async def get_destination(dest_key: str):
    """Get details of a specific destination."""
    dest = DESTINATIONS.get(dest_key.lower())
    if not dest:
        raise HTTPException(status_code=404, detail=f"Destination '{dest_key}' not found")
    return dest


@router.post("/train-model")
async def train_model():
    """Re-train the ML intent classifier."""
    result = intent_classifier.train()
    return {"status": "trained", "accuracy": result["accuracy"], "std": result["std"]}

"""
Chat Routes — /api/chat*
"""

from fastapi import APIRouter, Depends
from app.schemas import ChatRequest, ChatResponse
from app.controllers import chat_controller
from app.middleware.auth import get_optional_user, get_current_user, get_current_admin
from app.data.destinations import DESTINATIONS

router = APIRouter(tags=["Chat & AI"])


@router.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest, user: dict = Depends(get_optional_user)):
    """
    Main AI chat endpoint.
    Works without auth (guest) — saves history if authenticated.
    """
    user_id = user["id"] if user else None
    result = await chat_controller.process_chat_message(
        message=req.message, user_id=user_id, session_id=req.session_id,
    )
    return result


@router.get("/chat/history")
async def chat_history(current_user: dict = Depends(get_current_user)):
    """Get chat history for authenticated user."""
    history = await chat_controller.get_chat_history(current_user["id"])
    return {"success": True, "history": history}


@router.get("/model-info")
async def model_info():
    """ML model metadata."""
    return chat_controller.get_model_info()


@router.post("/train-model")
async def train_model(admin: dict = Depends(get_current_admin)):
    """Re-train ML model (admin only)."""
    result = chat_controller.retrain_model()
    return {"status": "trained", "accuracy": result["accuracy"], "std": result["std"]}


@router.get("/destinations")
async def list_destinations():
    """List all available destinations."""
    return {
        key: {
            "name": d["name"], "city": d["city"],
            "state": d["state"], "type": d["type"],
            "best_time": d["best_time"],
        }
        for key, d in DESTINATIONS.items()
    }


@router.get("/destinations/{key}")
async def get_destination(key: str):
    """Get details of a specific destination."""
    from fastapi import HTTPException
    dest = DESTINATIONS.get(key.lower())
    if not dest:
        raise HTTPException(status_code=404, detail=f"Destination '{key}' not found")
    return dest

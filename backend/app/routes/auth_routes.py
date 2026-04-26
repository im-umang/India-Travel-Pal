"""
Auth Routes — /api/auth/*
"""

from fastapi import APIRouter, Depends
from app.schemas import RegisterRequest, LoginRequest, AuthResponse
from app.controllers import auth_controller
from app.middleware.auth import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=AuthResponse)
async def register(req: RegisterRequest):
    """Register a new user with hashed password."""
    result = await auth_controller.register_user(
        name=req.name, email=req.email, password=req.password,
    )
    return result


@router.post("/login", response_model=AuthResponse)
async def login(req: LoginRequest):
    """Login and receive JWT token."""
    result = await auth_controller.login_user(
        email=req.email, password=req.password,
    )
    return result


@router.get("/me")
async def get_profile(current_user: dict = Depends(get_current_user)):
    """Get current user's profile (requires JWT)."""
    profile = await auth_controller.get_user_profile(current_user["id"])
    if profile:
        return {"success": True, "user": profile}
    return {"success": True, "user": current_user}


@router.get("/stats/{user_id}")
async def get_user_stats_legacy(user_id: str, current_user: dict = Depends(get_current_user)):
    """Keep this for backward compatibility."""
    stats = await auth_controller.get_dynamic_user_stats(user_id)
    return {"success": True, "stats": stats}

@router.get("/user-stats/{user_id}")
async def get_user_stats_refined(user_id: str, current_user: dict = Depends(get_current_user)):
    """Refined endpoint for profile stats."""
    # Verification
    if current_user["id"] != user_id and current_user.get("role") != "admin":
         return {"success": False, "error": "Unauthorized"}
    
    stats = await auth_controller.get_dynamic_user_stats(user_id)
    return {
        "totalSearches": stats.get("totalSearches", 0),
        "tripsPlanned": stats.get("tripsPlanned", 0)
    }

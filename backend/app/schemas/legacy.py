"""
Pydantic Schemas — Request/Response models for API validation
"""

from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List, Dict, Any, Union
from datetime import datetime
from enum import Enum


# ── Enums ──

class UserRole(str, Enum):
    USER = "user"
    ADMIN = "admin"


# ── Auth Schemas ──

class RegisterRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=100)

class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=1)

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str = "user"
    created_at: Optional[str] = None

class AuthResponse(BaseModel):
    success: bool
    user: Optional[UserResponse] = None
    token: Optional[str] = None
    error: Optional[str] = None


# ── Chat Schemas ──

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    reply: Union[str, Dict[str, Any], List[Any]]
    intent: str
    confidence: float
    entities: Dict[str, Any]
    session_id: Optional[str] = None


# ── Trip Schemas ──

class TripCreateRequest(BaseModel):
    source: str = Field(..., min_length=1, max_length=200)
    destination: str = Field(..., min_length=1, max_length=200)
    budget: Optional[str] = None
    travel_date: Optional[str] = None
    days: Optional[int] = Field(None, ge=1, le=30)
    suggestions: Optional[str] = None

class TripResponse(BaseModel):
    id: str
    user_id: str
    source: str
    destination: str
    budget: Optional[str] = None
    travel_date: Optional[str] = None
    days: Optional[int] = None
    suggestions: Optional[str] = None
    created_at: str


# ── Admin Schemas ──

class AdminUserUpdate(BaseModel):
    is_blocked: Optional[bool] = None
    role: Optional[UserRole] = None

class AdminStatsResponse(BaseModel):
    total_users: int
    total_trips: int
    total_chats: int
    active_users_today: int
    recent_signups: int

class AdminLogResponse(BaseModel):
    id: str
    admin_id: str
    admin_email: str
    action: str
    target: Optional[str] = None
    details: Optional[str] = None
    created_at: str

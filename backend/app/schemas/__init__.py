"""
Pydantic Schemas - Namespace Package
"""
# Import legacy schemas to maintain backward compatibility
from .legacy import (
    RegisterRequest,
    LoginRequest,
    UserResponse,
    AuthResponse,
    ChatRequest,
    ChatResponse,
    TripCreateRequest,
    TripResponse,
    AdminUserUpdate,
    AdminStatsResponse,
    AdminLogResponse
)

from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from pydantic import ValidationError
from app.core import security
from app.core.config import settings
from app.database import get_db as get_database
from app.schemas.user import TokenData, User
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId

reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/login"
)


async def get_db() -> AsyncIOMotorDatabase:
    return get_database()


async def get_current_user(
    db: AsyncIOMotorDatabase = Depends(get_db),
    token: str = Depends(reusable_oauth2)
) -> User:
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        sub = payload.get("sub")
        if not sub:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Could not validate credentials",
            )
        token_data = TokenData(sub=sub)
    except (JWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )

    try:
        user_doc = await db.users.find_one({"_id": ObjectId(token_data.sub)})
    except Exception:
        user_doc = None

    if not user_doc:
        raise HTTPException(status_code=404, detail="User not found")

    user_doc["id"] = str(user_doc["_id"])

    # Ensure role is correctly set — admin email always gets admin
    email = user_doc.get("email", "").lower()
    if email == settings.ADMIN_EMAIL.lower():
        user_doc["role"] = "admin"

    # Also check role from JWT token (may have been set on login)
    token_role = payload.get("role")
    if token_role and user_doc.get("role") != token_role:
        # Trust DB role over token if both exist, but if DB has no role, use token
        if not user_doc.get("role") or user_doc.get("role") == "user" and token_role == "admin":
            user_doc["role"] = token_role

    return User(**user_doc)


async def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

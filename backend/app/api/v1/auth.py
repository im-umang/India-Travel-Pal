from datetime import timedelta, datetime
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from app.core import security
from app.api.v1 import deps
from app.schemas import user as user_schema
from app.core.config import settings

router = APIRouter()


@router.post("/login", response_model=user_schema.Token)
async def login_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncIOMotorDatabase = Depends(deps.get_db)
) -> Any:
    # 1. Authenticate user - check both field names for compatibility
    user = await db.users.find_one({"email": form_data.username.lower().strip()})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password",
        )

    # 2. Verify password — support both hashed_password and password fields
    hashed_pw = user.get("hashed_password") or user.get("password", "")
    if not hashed_pw:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password",
        )

    # Try v1 verification first (argon2/bcrypt via passlib)
    pw_valid = False
    try:
        pw_valid = security.verify_password(form_data.password, hashed_pw)
    except Exception:
        pass

    # Fallback: try legacy bcrypt directly
    if not pw_valid:
        try:
            import bcrypt
            pw_valid = bcrypt.checkpw(
                form_data.password.encode("utf-8"),
                hashed_pw.encode("utf-8")
            )
        except Exception:
            pass

    if not pw_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password",
        )

    # 3. Get role from DB (ensure admin email is always admin)
    email = user.get("email", "").lower()
    db_role = user.get("role", "user")
    if email == settings.ADMIN_EMAIL.lower():
        db_role = "admin"

    # Update role in DB if needed
    if user.get("role") != db_role:
        await db.users.update_one(
            {"_id": user["_id"]},
            {"$set": {"role": db_role}}
        )

    # 4. Create token with role embedded
    access_token_expires = timedelta(minutes=security.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        user["_id"],
        expires_delta=access_token_expires,
        extra={"role": db_role, "email": email}
    )

    # 5. ✅ Update last_login so "Active Today" stat works in Admin Panel
    from datetime import timezone
    now_iso = datetime.now(timezone.utc).isoformat()
    await db.users.update_one(
        {"_id": user["_id"]},
        {"$set": {"last_login": now_iso}}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }


@router.post("/register", response_model=user_schema.User)
async def register_user(
    user_in: user_schema.UserCreate,
    db: AsyncIOMotorDatabase = Depends(deps.get_db)
) -> Any:
    # 1. Check if user exists
    email = user_in.email.lower().strip()
    user = await db.users.find_one({"email": email})
    if user:
        raise HTTPException(
            status_code=400,
            detail="A user with this email already exists.",
        )

    # 2. Determine role — admin email always gets admin role
    role = "admin" if email == settings.ADMIN_EMAIL.lower() else "user"

    # 3. Create user
    user_dict = user_in.model_dump()
    user_dict["email"] = email
    hashed_password = security.get_password_hash(user_dict.pop("password"))
    user_dict["hashed_password"] = hashed_password
    user_dict["role"] = role
    user_dict["is_active"] = True
    user_dict["is_blocked"] = False
    from datetime import timezone as _tz
    user_dict["created_at"] = datetime.now(_tz.utc).isoformat()  # ISO string for consistent querying
    user_dict["last_login"] = None

    result = await db.users.insert_one(user_dict)

    # 4. Return created user
    user_dict["id"] = str(result.inserted_id)
    return user_dict


@router.get("/me", response_model=user_schema.User)
async def read_users_me(
    current_user: user_schema.User = Depends(deps.get_current_active_user)
) -> Any:
    return current_user


@router.get("/user-stats/{user_id}")
async def get_user_stats(
    user_id: str,
    db: AsyncIOMotorDatabase = Depends(deps.get_db),
    current_user: user_schema.User = Depends(deps.get_current_active_user)
) -> Any:
    """Fetch real-time stats for profile page."""
    # Security check
    if str(current_user.id) != user_id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to see these stats")

    # Count from collections
    # Total Searches: records in user_queries
    total_searches = await db.user_queries.count_documents({"user_id": user_id})
    
    # Trips Planned: records in conversations
    trips_planned = await db.conversations.count_documents({"user_id": user_id})

    return {
        "totalSearches": total_searches,
        "tripsPlanned": trips_planned
    }


@router.patch("/me", response_model=user_schema.User)
async def update_user_me(
    user_in: user_schema.UserUpdate,
    db: AsyncIOMotorDatabase = Depends(deps.get_db),
    current_user: user_schema.User = Depends(deps.get_current_active_user)
) -> Any:
    """Update current user profile."""
    update_data = user_in.model_dump(exclude_unset=True)
    
    if "password" in update_data:
        update_data["hashed_password"] = security.get_password_hash(update_data.pop("password"))
    
    if update_data:
        await db.users.update_one(
            {"_id": ObjectId(current_user.id)},
            {"$set": update_data}
        )
        
        # Fetch updated user
        updated_user = await db.users.find_one({"_id": ObjectId(current_user.id)})
        if updated_user:
            updated_user["id"] = str(updated_user["_id"])
            return updated_user
        
    return current_user

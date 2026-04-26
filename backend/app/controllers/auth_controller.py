"""
Auth Controller — Handles registration, login, and user profile
"""

from datetime import datetime, timezone
from app.database import get_db
from app.middleware.auth import hash_password, verify_password, create_access_token
from app.config import settings


async def register_user(name: str, email: str, password: str) -> dict:
    """Register a new user."""
    db = get_db()

    # ── MongoDB path ──
    if db is not None:
        # Check if email already exists
        existing = await db.users.find_one({"email": email.lower()})
        if existing:
            return {"success": False, "error": "Email already registered"}

        # Create user document
        user_doc = {
            "name": name.strip(),
            "email": email.lower().strip(),
            "password": hash_password(password),
            "role": "admin" if email.lower() == settings.ADMIN_EMAIL else "user",
            "is_blocked": False,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "last_login": None,
        }

        result = await db.users.insert_one(user_doc)
        user_id = str(result.inserted_id)
    else:
        # ── Fallback (no DB) ──
        user_id = f"user_{int(datetime.now(timezone.utc).timestamp())}"

    # Generate JWT token
    token = create_access_token({
        "sub": user_id,
        "email": email.lower(),
        "role": "admin" if email.lower() == settings.ADMIN_EMAIL else "user",
    })

    return {
        "success": True,
        "user": {
            "id": user_id,
            "name": name.strip(),
            "email": email.lower(),
            "role": "admin" if email.lower() == settings.ADMIN_EMAIL else "user",
        },
        "token": token,
    }


async def login_user(email: str, password: str) -> dict:
    """Authenticate a user and return JWT token."""
    db = get_db()

    if db is not None:
        # Find user
        user = await db.users.find_one({"email": email.lower()})

        if not user:
            return {"success": False, "error": "Invalid email or password"}

        if not verify_password(password, user["password"]):
            return {"success": False, "error": "Invalid email or password"}

        if user.get("is_blocked", False):
            return {"success": False, "error": "Your account has been blocked. Contact admin."}

        # Update last login
        await db.users.update_one(
            {"_id": user["_id"]},
            {"$set": {"last_login": datetime.now(timezone.utc).isoformat()}},
        )

        user_id = str(user["_id"])
        role = user.get("role", "user")
        name = user["name"]
    else:
        # ── Fallback (no DB) — accept any valid credentials ──
        if len(password) < 6:
            return {"success": False, "error": "Invalid credentials"}

        user_id = f"user_{abs(hash(email)) % 100000}"
        role = "admin" if email.lower() == settings.ADMIN_EMAIL else "user"
        name = email.split("@")[0].title()

    token = create_access_token({
        "sub": user_id,
        "email": email.lower(),
        "role": role,
    })

    return {
        "success": True,
        "user": {
            "id": user_id,
            "name": name,
            "email": email.lower(),
            "role": role,
        },
        "token": token,
    }


async def get_user_profile(user_id: str) -> dict:
    """Get user profile by ID with extended stats."""
    db = get_db()
    if db is None: return None

    from bson import ObjectId
    try:
        user = await db.users.find_one({"_id": ObjectId(user_id)})
        if not user: return None
        
        # --- 1. Fetch User Stats ---
        # Total Searches
        total_searches = await db.user_queries.count_documents({"user_id": user_id})
        
        # Total Trips Planned (Intent: plan_trip)
        total_trips = await db.user_queries.count_documents({
            "user_id": user_id, 
            "intent": {"$in": ["plan_trip", "Travel Planning"]}
        })
        
        # Favorite Destination
        fav_dest = "India"
        pipeline = [
            {"$match": {"user_id": user_id, "place": {"$ne": None}}},
            {"$group": {"_id": "$place", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}},
            {"$limit": 1}
        ]
        async for res in db.user_queries.aggregate(pipeline):
            fav_dest = res["_id"]

        # Last Active (from last search or login)
        last_search = await db.user_queries.find_one(
            {"user_id": user_id}, 
            sort=[("timestamp", -1)]
        )
        last_active = last_search["timestamp"] if last_search else user.get("last_login")

        return {
            "id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"],
            "role": user.get("role", "user"),
            "created_at": user.get("created_at", ""),
            "last_active": last_active,
            "stats": {
                "total_trips": total_trips,
                "total_searches": total_searches,
                "fav_dest": fav_dest,
            }
        }
    except Exception as e:
        print(f"⚠️ Profile Fetch Error: {e}")
        return None

async def get_dynamic_user_stats(user_id: str) -> dict:
    """Fetch real-time stats count from collections."""
    db = get_db()
    if db is None:
        return {"totalSearches": 0, "tripsPlanned": 0}

    try:
        # 1. Count Total Searches (from user_queries)
        total_searches = await db.user_queries.count_documents({"user_id": user_id})
        
        # 2. Count Trips Planned (from conversations collection)
        trips_planned = await db.conversations.count_documents({"user_id": user_id})
        
        return {
            "totalSearches": total_searches,
            "tripsPlanned": trips_planned
        }
    except Exception:
        return {"totalSearches": 0, "tripsPlanned": 0}

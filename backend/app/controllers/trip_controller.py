"""
Trip Controller — CRUD operations for saved trips
"""

from datetime import datetime, timezone
from typing import Optional
from app.database import get_db


async def create_trip(
    user_id: str,
    source: str,
    destination: str,
    budget: Optional[str] = None,
    travel_date: Optional[str] = None,
    days: Optional[int] = None,
    suggestions: Optional[str] = None,
) -> dict:
    """Create a new trip record."""
    db = get_db()
    now = datetime.now(timezone.utc).isoformat()

    trip_doc = {
        "user_id": user_id,
        "source": source.strip(),
        "destination": destination.strip(),
        "budget": budget,
        "travel_date": travel_date,
        "days": days,
        "suggestions": suggestions,
        "created_at": now,
    }

    if db is not None:
        result = await db.trips.insert_one(trip_doc)
        trip_doc["id"] = str(result.inserted_id)
    else:
        trip_doc["id"] = f"trip_{int(datetime.now(timezone.utc).timestamp())}"

    trip_doc.pop("_id", None)
    return trip_doc


async def get_user_trips(user_id: str, limit: int = 20, skip: int = 0) -> list:
    """Get trips for a specific user."""
    db = get_db()
    if db is None:
        return []

    try:
        cursor = db.trips.find(
            {"user_id": user_id}
        ).sort("created_at", -1).skip(skip).limit(limit)

        trips = []
        async for trip in cursor:
            trip["id"] = str(trip.pop("_id"))
            trips.append(trip)
        return trips
    except Exception as e:
        print(f"⚠️  Failed to get trips: {e}")
        return []


async def get_trip_by_id(trip_id: str, user_id: str) -> Optional[dict]:
    """Get a specific trip by ID (user must own it)."""
    db = get_db()
    if db is None:
        return None

    try:
        from bson import ObjectId
        trip = await db.trips.find_one({
            "_id": ObjectId(trip_id),
            "user_id": user_id,
        })
        if trip:
            trip["id"] = str(trip.pop("_id"))
            return trip
        return None
    except Exception as e:
        print(f"⚠️  Failed to get trip: {e}")
        return None


async def delete_trip(trip_id: str, user_id: str) -> bool:
    """Delete a trip (user must own it)."""
    db = get_db()
    if db is None:
        return False

    try:
        from bson import ObjectId
        result = await db.trips.delete_one({
            "_id": ObjectId(trip_id),
            "user_id": user_id,
        })
        return result.deleted_count > 0
    except Exception as e:
        print(f"⚠️  Failed to delete trip: {e}")
        return False

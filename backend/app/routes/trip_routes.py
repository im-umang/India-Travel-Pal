"""
Trip Routes — /api/trips/*
"""

from fastapi import APIRouter, Depends, HTTPException
from app.schemas import TripCreateRequest, TripResponse
from app.controllers import trip_controller
from app.middleware.auth import get_current_user

router = APIRouter(prefix="/trips", tags=["Trips"])


@router.post("/")
async def create_trip(req: TripCreateRequest, user: dict = Depends(get_current_user)):
    """Save a new trip plan."""
    trip = await trip_controller.create_trip(
        user_id=user["id"],
        source=req.source,
        destination=req.destination,
        budget=req.budget,
        travel_date=req.travel_date,
        days=req.days,
        suggestions=req.suggestions,
    )
    return {"success": True, "trip": trip}


@router.get("/")
async def get_my_trips(
    skip: int = 0, limit: int = 20,
    user: dict = Depends(get_current_user),
):
    """Get authenticated user's saved trips."""
    trips = await trip_controller.get_user_trips(user["id"], limit=limit, skip=skip)
    return {"success": True, "trips": trips, "count": len(trips)}


@router.get("/{trip_id}")
async def get_trip(trip_id: str, user: dict = Depends(get_current_user)):
    """Get a specific trip."""
    trip = await trip_controller.get_trip_by_id(trip_id, user["id"])
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    return {"success": True, "trip": trip}


@router.delete("/{trip_id}")
async def delete_trip(trip_id: str, user: dict = Depends(get_current_user)):
    """Delete a saved trip."""
    deleted = await trip_controller.delete_trip(trip_id, user["id"])
    if not deleted:
        raise HTTPException(status_code=404, detail="Trip not found")
    return {"success": True, "message": "Trip deleted"}

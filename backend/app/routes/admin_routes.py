"""
Admin Routes — /api/admin/*
All routes require admin role.
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from app.controllers import admin_controller
from app.middleware.auth import get_current_admin
from app.schemas import AdminUserUpdate

router = APIRouter(prefix="/admin", tags=["Admin Panel"])


@router.get("/stats")
async def dashboard_stats(admin: dict = Depends(get_current_admin)):
    """Get basic admin dashboard stats."""
    stats = await admin_controller.get_admin_stats()
    return {"success": True, "stats": stats}


@router.get("/analytics")
async def rich_analytics(
    period: str = Query("today", pattern="^(today|week|month)$"),
    admin: dict = Depends(get_current_admin)
):
    """Get advanced travel business insights and peak metrics with period filtering."""
    data = await admin_controller.get_admin_analytics(period=period)
    return {"success": True, "analytics": data}


@router.get("/users")
async def list_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    admin: dict = Depends(get_current_admin),
):
    """List all users."""
    users = await admin_controller.get_all_users(skip=skip, limit=limit)
    return {"success": True, "users": users, "count": len(users)}


@router.get("/trips")
async def list_all_trips(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    admin: dict = Depends(get_current_admin),
):
    """List all trips from all users."""
    trips = await admin_controller.get_all_trips(skip=skip, limit=limit)
    return {"success": True, "trips": trips, "count": len(trips)}


@router.delete("/trips/{trip_id}")
async def delete_trip_admin(trip_id: str, admin: dict = Depends(get_current_admin)):
    """Admin can delete any trip."""
    from app.database import get_db
    from bson import ObjectId
    db = get_db()
    if db is None:
        raise HTTPException(status_code=503, detail="Database unavailable")
    try:
        result = await db.trips.delete_one({"_id": ObjectId(trip_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Trip not found")
        return {"success": True, "message": "Trip deleted"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.patch("/users/{user_id}/block")
async def block_user(user_id: str, admin: dict = Depends(get_current_admin)):
    """Block a user."""
    success = await admin_controller.block_user(user_id, blocked=True, admin_id=admin["id"])
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    return {"success": True, "message": "User blocked"}


@router.patch("/users/{user_id}/unblock")
async def unblock_user(user_id: str, admin: dict = Depends(get_current_admin)):
    """Unblock a user."""
    success = await admin_controller.block_user(user_id, blocked=False, admin_id=admin["id"])
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    return {"success": True, "message": "User unblocked"}


@router.delete("/users/{user_id}")
async def delete_user(user_id: str, admin: dict = Depends(get_current_admin)):
    """Delete a user and all their data."""
    success = await admin_controller.delete_user(user_id, admin_id=admin["id"])
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    return {"success": True, "message": "User deleted"}


@router.patch("/users/{user_id}/role")
async def update_role(
    user_id: str,
    update: AdminUserUpdate,
    admin: dict = Depends(get_current_admin),
):
    """Change a user's role."""
    if update.role:
        success = await admin_controller.update_user_role(user_id, update.role.value, admin["id"])
        if not success:
            raise HTTPException(status_code=404, detail="User not found")
    return {"success": True, "message": "User updated"}


@router.get("/logs")
async def activity_logs(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    admin: dict = Depends(get_current_admin),
):
    """Get admin activity logs."""
    logs = await admin_controller.get_admin_logs(skip=skip, limit=limit)
    return {"success": True, "logs": logs, "count": len(logs)}


@router.get("/chat-history")
async def all_chat_history(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    admin: dict = Depends(get_current_admin),
):
    """Get all users chat history (using conversations collection)."""
    from app.database import get_db
    db = get_db()
    if db is None:
        return {"success": True, "chats": [], "count": 0}
    try:
        # Use conversations collection as it's the primary storage
        cursor = db.conversations.find({}).sort("updated_at", -1).skip(skip).limit(limit)
        chats = []
        async for c in cursor:
            c["id"] = str(c.pop("_id"))
            # Normalize messages field if it exists
            msgs = c.get("messages", [])
            for m in msgs:
                if isinstance(m.get("content"), dict):
                    m["content"] = m["content"].get("reply") or m["content"].get("message") or "[Structured data]"
            c["messages"] = msgs
            chats.append(c)
        total = await db.conversations.count_documents({})
        return {"success": True, "chats": chats, "count": total}
    except Exception as e:
        return {"success": False, "error": str(e), "chats": [], "count": 0}


@router.get("/conversations")
async def all_conversations(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=200),
    admin: dict = Depends(get_current_admin),
):
    """Get all conversations from conversations collection."""
    from app.database import get_db
    db = get_db()
    if db is None:
        return {"success": True, "conversations": [], "count": 0}
    try:
        # Include messages (was incorrectly excluded with {"messages": 0})
        cursor = db.conversations.find({}).sort("updated_at", -1).skip(skip).limit(limit)
        convs = []
        async for c in cursor:
            c["id"] = str(c.pop("_id"))
            msgs = c.get("messages", [])
            # Add message_count for display badge, normalize content
            c["message_count"] = len(msgs)
            # Normalize: ensure content is always str for admin display
            normalized = []
            for m in msgs:
                content = m.get("content", "")
                if isinstance(content, dict):
                    content = content.get("reply") or content.get("message") or "[Structured response]"
                normalized.append({
                    "role": m.get("role", "user"),
                    "content": content,
                    "language": m.get("language", "en"),
                    "timestamp": str(m.get("timestamp", ""))
                })
            c["messages"] = normalized
            convs.append(c)
        total = await db.conversations.count_documents({})
        return {"success": True, "conversations": convs, "count": total}
    except Exception as e:
        return {"success": False, "error": str(e), "conversations": [], "count": 0}


@router.get("/conversations/{conv_id}/messages")
async def get_conversation_messages(
    conv_id: str,
    admin: dict = Depends(get_current_admin),
):
    """Get messages of a specific conversation."""
    from app.database import get_db
    from bson import ObjectId
    db = get_db()
    if db is None:
        return {"success": True, "messages": []}
    try:
        try:
            oid = ObjectId(conv_id)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid conversation ID")
        conv = await db.conversations.find_one({"_id": oid})
        if not conv:
            raise HTTPException(status_code=404, detail="Conversation not found")
        return {
            "success": True,
            "messages": conv.get("messages", []),
            "title": conv.get("title", "Untitled"),
            "user_id": conv.get("user_id", ""),
        }
    except HTTPException:
        raise
    except Exception as e:
        return {"success": False, "error": str(e), "messages": []}

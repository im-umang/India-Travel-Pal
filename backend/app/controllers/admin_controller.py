"""
Admin Controller — Admin dashboard operations
"""

from datetime import datetime, timedelta, timezone
from typing import Optional, List, Dict, Any
from app.database import get_db

async def get_admin_stats() -> dict:
    """Get rich dashboard analytics.
    
    NOTE: dates (created_at, last_login) are stored as ISO strings like
    "2026-04-11T06:39:46+00:00" — so we compare using ISO string prefixes,
    NOT datetime objects (which always returns 0 due to type mismatch).
    """
    db = get_db()
    from datetime import timezone

    empty = {
        "total_users": 0, "total_trips": 0, "total_chats": 0,
        "active_users_today": 0, "recent_signups": 0, "blocked_users": 0,
        "recent_users": [], "recent_conversations": [], "daily_signups": [],
        "daily_activity": [],
    }
    if db is None:
        return empty

    try:
        now = datetime.now(timezone.utc)
        today_iso    = now.strftime("%Y-%m-%d")           # "2026-04-11"
        week_ago_dt  = now - timedelta(days=7)            # native datetime for $gte
        week_ago_iso = week_ago_dt.strftime("%Y-%m-%dT%H:%M:%S")  # ISO string for string compare

        # ── Core counts ──
        total_users   = await db.users.count_documents({})
        total_trips   = await db.trips.count_documents({})
        total_chats   = await db.conversations.count_documents({})
        blocked_users = await db.users.count_documents({"is_blocked": True})

        # ✅ Active Today: last_login stored as ISO string e.g. "2026-04-16T..."
        # Use regex prefix match on today's date
        active_today = await db.users.count_documents({
            "last_login": {"$regex": f"^{today_iso}"}
        })

        # ✅ New This Week: created_at may be stored as datetime object OR ISO string
        # Query both cases with $or so old & new accounts are counted correctly
        recent_signups = await db.users.count_documents({
            "$or": [
                {"created_at": {"$gte": week_ago_dt}},          # native datetime (new registrations)
                {"created_at": {"$gte": week_ago_iso, "$type": "string"}},  # ISO string (legacy)
            ]
        })

        # ── Recent 5 users ──
        recent_users = []
        async for u in db.users.find({}, {"password": 0}).sort("created_at", -1).limit(5):
            u["id"] = str(u.pop("_id"))
            u["created_at"] = str(u.get("created_at", ""))
            u["last_login"]  = str(u.get("last_login", ""))
            recent_users.append(u)

        # ── Recent 5 conversations ──
        recent_convs = []
        async for c in db.conversations.find({}).sort("updated_at", -1).limit(5):
            msgs = c.get("messages", [])
            last_user = next((m for m in reversed(msgs) if m.get("role") == "user"), None)
            preview = ""
            if last_user:
                content = last_user.get("content", "")
                if isinstance(content, dict):
                    content = content.get("reply") or content.get("message") or str(content)
                preview = str(content)[:80]
            recent_convs.append({
                "id": str(c.get("_id", "")),
                "user_id": c.get("user_id", ""),
                "title": c.get("title", "Conversation"),
                "message_count": len(msgs),
                "preview": preview,
                "updated_at": str(c.get("updated_at", "")),
            })

        # ── 7-day daily activity chart ──
        # Counts conversations updated each day + messages + active users
        daily_signups = []
        daily_activity = []
        for i in range(6, -1, -1):
            day = now - timedelta(days=i)
            day_prefix = day.strftime("%Y-%m-%d")

            # New users registered this day
            new_users = await db.users.count_documents({
                "created_at": {"$regex": f"^{day_prefix}"}
            })
            daily_signups.append({
                "date": day.strftime("%d %b"),
                "count": new_users,
            })

            # Conversations that were active (updated) this day
            conv_day = await db.conversations.count_documents({
                "updated_at": {"$regex": f"^{day_prefix}"}
            })

            # Users who logged in this day
            users_active = await db.users.count_documents({
                "last_login": {"$regex": f"^{day_prefix}"}
            })

            # Total messages sent this day — sum message counts of active conversations
            msg_count = 0
            async for conv in db.conversations.find(
                {"updated_at": {"$regex": f"^{day_prefix}"}},
                {"messages": 1}
            ):
                msg_count += len(conv.get("messages", []))

            daily_activity.append({
                "date": day.strftime("%d %b"),
                "conversations": conv_day,
                "messages": msg_count,
                "active_users": users_active,
            })

        return {
            "total_users":        total_users,
            "total_trips":        total_trips,
            "total_chats":        total_chats,
            "active_users_today": active_today,
            "recent_signups":     recent_signups,
            "blocked_users":      blocked_users,
            "recent_users":       recent_users,
            "recent_conversations": recent_convs,
            "daily_signups":      daily_signups,
            "daily_activity":     daily_activity,
        }
    except Exception as e:
        print(f"⚠️  Failed to get stats: {e}")
        import traceback; traceback.print_exc()
        return empty


async def get_all_users(skip: int = 0, limit: int = 50) -> list:
    """Get all users (for admin panel)."""
    db = get_db()
    if db is None:
        return []

    try:
        cursor = db.users.find(
            {},
            {"password": 0},  # Never return passwords
        ).sort("created_at", -1).skip(skip).limit(limit)

        users = []
        async for user in cursor:
            user["id"] = str(user.pop("_id"))
            users.append(user)
        return users
    except Exception as e:
        print(f"⚠️  Failed to get users: {e}")
        return []


async def get_all_trips(skip: int = 0, limit: int = 50) -> list:
    """Get all trips (for admin panel)."""
    db = get_db()
    if db is None:
        return []

    try:
        cursor = db.trips.find({}).sort("created_at", -1).skip(skip).limit(limit)
        trips = []
        async for trip in cursor:
            trip["id"] = str(trip.pop("_id"))
            trips.append(trip)
        return trips
    except Exception as e:
        print(f"⚠️  Failed to get trips: {e}")
        return []


async def block_user(user_id: str, blocked: bool, admin_id: str) -> bool:
    """Block or unblock a user."""
    db = get_db()
    if db is None:
        return False

    try:
        from bson import ObjectId
        result = await db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"is_blocked": blocked}},
        )
        if result.modified_count > 0:
            await _log_admin_action(
                admin_id=admin_id,
                action="block_user" if blocked else "unblock_user",
                target=user_id,
            )
            return True
        return False
    except Exception as e:
        print(f"⚠️  Failed to block user: {e}")
        return False


async def delete_user(user_id: str, admin_id: str) -> bool:
    """Delete a user and their data."""
    db = get_db()
    if db is None:
        return False

    try:
        from bson import ObjectId

        # Delete user
        result = await db.users.delete_one({"_id": ObjectId(user_id)})

        if result.deleted_count > 0:
            # Also delete their trips and chat history
            await db.trips.delete_many({"user_id": user_id})
            await db.conversations.delete_many({"user_id": user_id})

            await _log_admin_action(
                admin_id=admin_id,
                action="delete_user",
                target=user_id,
                details="User and all associated data deleted",
            )
            return True
        return False
    except Exception as e:
        print(f"⚠️  Failed to delete user: {e}")
        return False


async def update_user_role(user_id: str, role: str, admin_id: str) -> bool:
    """Change a user's role."""
    db = get_db()
    if db is None:
        return False

    try:
        from bson import ObjectId
        result = await db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"role": role}},
        )
        if result.modified_count > 0:
            await _log_admin_action(
                admin_id=admin_id,
                action="update_role",
                target=user_id,
                details=f"Role changed to {role}",
            )
            return True
        return False
    except Exception as e:
        print(f"⚠️  Failed to update role: {e}")
        return False


async def get_admin_logs(skip: int = 0, limit: int = 50) -> list:
    """Get admin activity logs."""
    db = get_db()
    if db is None:
        return []

    try:
        cursor = db.admin_logs.find({}).sort("created_at", -1).skip(skip).limit(limit)
        logs = []
        async for log in cursor:
            log["id"] = str(log.pop("_id"))
            logs.append(log)
        return logs
    except Exception as e:
        print(f"⚠️  Failed to get logs: {e}")
        return []


async def get_admin_analytics(period: str = "today") -> dict:
    """Perform complex multi-comparison aggregations for advanced travel insights.
    
    Uses: user_queries, chat_sessions, searched_places, user_activity
    """
    db = get_db()
    if db is None: return {}

    now = datetime.now(timezone.utc)
    
    # Define time ranges
    if period == "week":
        curr_start = now - timedelta(days=7)
        prev_start = now - timedelta(days=14)
    elif period == "month":
        curr_start = now - timedelta(days=30)
        prev_start = now - timedelta(days=60)
    else: # today
        curr_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        prev_start = curr_start - timedelta(days=1)

    iso_curr = curr_start.isoformat()
    iso_prev = prev_start.isoformat()
    iso_now = now.isoformat()

    try:
        # --- 1. CORE METRICS (Aggregation from analytics) ---
        async def get_period_metrics(start_iso, end_iso=None):
            match = {"timestamp": {"$gte": start_iso}}
            if end_iso: match["timestamp"]["$lt"] = end_iso
            
            pipeline = [
                {"$match": match},
                {"$group": {
                    "_id": None,
                    "searches": {"$sum": 1},
                    "avg_latency": {"$avg": "$latency_ms"},
                    "success": {"$sum": {"$cond": [{"$eq": ["$status", "success"]}, 1, 0]}},
                    "unique_users": {"$addToSet": "$user_id"}
                }}
            ]
            async for res in db.analytics.aggregate(pipeline):
                res["user_count"] = len(res.get("unique_users", []))
                return res
            return {"searches": 0, "avg_latency": 0, "success": 0, "user_count": 0}

        curr_metrics = await get_period_metrics(iso_curr)
        prev_metrics = await get_period_metrics(iso_prev, iso_curr)

        # Calculate Growth (%)
        def calc_growth(curr, prev):
            if not prev: return 100 if curr > 0 else 0
            return int(((curr - prev) / prev) * 100)

        growth = {
            "searches": calc_growth(curr_metrics["searches"], prev_metrics["searches"]),
            "latency": int(curr_metrics["avg_latency"] or 0),
            "success_rate": int((curr_metrics["success"] / (curr_metrics["searches"] or 1)) * 100)
        }

        # --- 2. TREND DATA (Growth Analytics Line Chart) ---
        trend_data = []
        if period == "today":
            # Hourly data (0-23)
            for h in range(24):
                hour_str = f"{h:02d}:00"
                h_prefix = f"{curr_start.date().isoformat()}T{h:02d}:"
                count = await db.analytics.count_documents({"timestamp": {"$regex": f"^{h_prefix}"}})
                trend_data.append({"time": hour_str, "value": count})
        elif period == "week":
            # Daily data (Mon-Sun)
            for i in range(6, -1, -1):
                day = now - timedelta(days=i)
                d_prefix = day.date().isoformat()
                label = day.strftime("%a")
                count = await db.analytics.count_documents({"timestamp": {"$regex": f"^{d_prefix}"}})
                trend_data.append({"time": label, "value": count})
        else: # month
            # Date-wise data (1-30)
            for i in range(29, -1, -1):
                day = now - timedelta(days=i)
                d_prefix = day.date().isoformat()
                label = day.strftime("%d %b")
                count = await db.analytics.count_documents({"timestamp": {"$regex": f"^{d_prefix}"}})
                trend_data.append({"time": label, "value": count})

        # --- 3. DESTINATION MARKET COMPARISON (Top 5) ---
        dest_comparison = []
        pipeline_dest = [
            {"$match": {"place": {"$ne": None}, "timestamp": {"$gte": iso_curr}}},
            {"$group": {
                "_id": "$place",
                "count": {"$sum": 1},
                "budget_luxury": {"$sum": {"$cond": [{"$eq": ["$budget", "Luxury"]}, 1, 0]}},
                "budget_mid": {"$sum": {"$cond": [{"$eq": ["$budget", "Mid-range"]}, 1, 0]}},
                "budget_low": {"$sum": {"$cond": [{"$eq": ["$budget", "Low"]}, 1, 0]}},
                "mode_flight": {"$sum": {"$cond": [{"$eq": ["$transport_mode", "Flight"]}, 1, 0]}},
                "mode_train": {"$sum": {"$cond": [{"$eq": ["$transport_mode", "Train"]}, 1, 0]}},
                "mode_bus": {"$sum": {"$cond": [{"$eq": ["$transport_mode", "Bus"]}, 1, 0]}},
                "mode_taxi": {"$sum": {"$cond": [{"$eq": ["$transport_mode", "Taxi"]}, 1, 0]}}
            }},
            {"$sort": {"count": -1}},
            {"$limit": 5}
        ]
        async for d in db.analytics.aggregate(pipeline_dest):
            # Most common budget preference
            b_counts = {"Low": d["budget_low"], "Mid": d["budget_mid"], "Lux": d["budget_luxury"]}
            top_budget = max(b_counts, key=b_counts.get) if any(b_counts.values()) else "N/A"
            
            # Primary transport mode
            m_counts = {"Flight": d["mode_flight"], "Train": d["mode_train"], "Bus": d["mode_bus"], "Taxi": d["mode_taxi"]}
            top_mode = max(m_counts, key=m_counts.get) if any(m_counts.values()) else "N/A"

            dest_comparison.append({
                "name": d["_id"],
                "value": d["count"],
                "budgets": b_counts,
                "modes": m_counts,
                "top_budget": top_budget,
                "top_mode": top_mode
            })

        # --- 4. USER INTENT SEGMENTS ---
        categories = []
        pipeline_intent = [
            {"$match": {"timestamp": {"$gte": iso_curr}}},
            {"$group": {"_id": "$intent", "count": {"$sum": 1}}}
        ]
        total_queries = curr_metrics["searches"] or 1
        async for c in db.analytics.aggregate(pipeline_intent):
            label = str(c["_id"]).capitalize() if c["_id"] else "Other"
            categories.append({
                "name": label,
                "value": c["count"],
                "percentage": int((c["count"] / total_queries) * 100)
            })

        # --- 5. MULTI-COMPARISON SECTIONS ---
        # Growth Dynamics: New vs Returning
        new_users_count = await db.users.count_documents({"created_at": {"$gte": iso_curr}})
        
        user_segments = {
            "new_vs_returning": [
                {"name": "New", "value": new_users_count},
                {"name": "Returning", "value": max(0, curr_metrics["user_count"] - new_users_count)}
            ],
            "budget_dist": []
        }

        # Spending Profile
        pipeline_budget = [
            {"$match": {"timestamp": {"$gte": iso_curr}}},
            {"$group": {"_id": "$budget", "count": {"$sum": 1}}}
        ]
        async for b in db.analytics.aggregate(pipeline_budget):
            if b["_id"]: user_segments["budget_dist"].append({"name": b["_id"], "value": b["count"]})

        # Logistics Mix
        travel_modes = []
        pipeline_modes = [
            {"$match": {"timestamp": {"$gte": iso_curr}}},
            {"$group": {"_id": "$transport_mode", "count": {"$sum": 1}}}
        ]
        async for m in db.analytics.aggregate(pipeline_modes):
            if m["_id"]: travel_modes.append({"name": m["_id"], "value": m["count"]})

        # Operational Health
        performance = {
            "success": curr_metrics["success"],
            "total": curr_metrics["searches"],
            "avg_latency": int(curr_metrics["avg_latency"] or 0),
            "error_rate": int(((curr_metrics["searches"] - curr_metrics["success"]) / total_queries) * 100)
        }

        return {
            "period": period,
            "growth": growth,
            "totals": {
                "searches": curr_metrics["searches"],
                "users": await db.users.count_documents({}),
                "sessions": await db.chat_sessions.count_documents({"updated_at": {"$gte": iso_curr}})
            },
            "dest_comparison": dest_comparison,
            "trend_data": trend_data,
            "user_segments": user_segments,
            "categories": categories,
            "travel_modes": travel_modes,
            "performance": performance
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"⚠️  Advanced Aggregation Error: {e}")
        return {}

async def _log_admin_action(
    admin_id: str,
    action: str,
    target: Optional[str] = None,
    details: Optional[str] = None,
):
    """Log an admin action."""
    db = get_db()
    if db is None:
        return

    try:
        await db.admin_logs.insert_one({
            "admin_id": admin_id,
            "admin_email": "",
            "action": action,
            "target": target,
            "details": details,
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
    except Exception as e:
        print(f"⚠️  Failed to log admin action: {e}")

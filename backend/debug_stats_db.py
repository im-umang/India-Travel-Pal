from app.database import get_db, connect_database
import asyncio
from bson import ObjectId

async def debug_stats():
    await connect_database()
    db = get_db()
    if db is None: return

    print("\n--- Trips Sample ---")
    t = await db.trips.find_one()
    if t: print(f"Keys: {list(t.keys())}\nUser ID Field: {t.get('user_id')} (Type: {type(t.get('user_id'))})")
    
    print("\n--- User Queries Sample ---")
    q = await db.user_queries.find_one()
    if q: print(f"Keys: {list(q.keys())}\nUser ID Field: {q.get('user_id')} (Type: {type(q.get('user_id'))})")

    print("\n--- chat_sessions Sample ---")
    s = await db.chat_sessions.find_one()
    if s: print(f"Keys: {list(s.keys())}\nUser ID Field: {s.get('user_id')} (Type: {type(s.get('user_id'))})")

    print("\n--- conversations Sample ---")
    c = await db.conversations.find_one()
    if c: print(f"Keys: {list(c.keys())}\nUser ID Field: {c.get('user_id')} (Type: {type(c.get('user_id'))})")

    print("\n--- All User Counts ---")
    async for user in db.users.find():
        uid_str = str(user["_id"])
        email = user.get("email", "N/A")
        name = user.get("name", "N/A")
        
        q_count = await db.user_queries.count_documents({"user_id": uid_str})
        c_count = await db.conversations.count_documents({"user_id": uid_str})
        s_count = await db.chat_sessions.count_documents({"user_id": uid_str})
        
        print(f"User: {name} | {email} ({uid_str})")
        print(f"  Queries: {q_count}, Conversations: {c_count}, Sessions: {s_count}")
        print("-" * 50)

if __name__ == "__main__":
    asyncio.run(debug_stats())

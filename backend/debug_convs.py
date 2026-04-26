"""Debug conversations collection structure"""
import asyncio
import json
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime

def ser(obj):
    if isinstance(obj, dict): return {k: ser(v) for k, v in obj.items()}
    elif isinstance(obj, list): return [ser(i) for i in obj]
    elif isinstance(obj, datetime): return str(obj)
    else: return obj

async def debug():
    client = AsyncIOMotorClient('mongodb://localhost:27017')
    db = client['india_travel_pal']
    
    print("=== CONVERSATIONS collection ===")
    conv = await db.conversations.find_one({})
    if conv:
        conv.pop('_id', None)
        print("KEYS:", list(conv.keys()))
        print(json.dumps(ser(conv), indent=2, ensure_ascii=False)[:800])
    else:
        print("No conversations")
    
    total = await db.conversations.count_documents({})
    print(f"\nTotal conversations: {total}")
    
    # Check messages field
    print("\n=== Sample with messages field ===")
    with_msgs = await db.conversations.find_one({"messages": {"$exists": True}})
    if with_msgs:
        with_msgs.pop('_id', None)
        print("Has messages field:", 'messages' in with_msgs)
        if 'messages' in with_msgs:
            msgs = with_msgs.get('messages', [])
            print(f"Message count: {len(msgs)}")
            if msgs:
                print("First msg keys:", list(msgs[0].keys()) if isinstance(msgs[0], dict) else msgs[0])
    
    client.close()

asyncio.run(debug())

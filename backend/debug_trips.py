"""Debug script — check actual trip document structure in MongoDB"""
import asyncio
import json
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime

def make_serializable(obj):
    if isinstance(obj, dict):
        return {k: make_serializable(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [make_serializable(i) for i in obj]
    elif isinstance(obj, datetime):
        return str(obj)
    else:
        return obj

async def debug_trips():
    client = AsyncIOMotorClient('mongodb://localhost:27017')
    db = client['india_travel_pal']
    
    print("=== TRIPS collection ===")
    cursor = db.trips.find().sort("created_at", -1).limit(2)
    trips = await cursor.to_list(length=2)
    for t in trips:
        t.pop('_id', None)
        print("KEYS:", list(t.keys()))
        print(json.dumps(make_serializable(t), indent=2, ensure_ascii=False)[:600])
        print("---")
    
    total = await db.trips.count_documents({})
    print(f"\nTotal trips: {total}")
    
    print("\n=== CHAT_HISTORY collection ===")
    ch = await db.chat_history.find_one({})
    if ch:
        ch.pop('_id', None)
        print("KEYS:", list(ch.keys()))
        if 'messages' in ch and ch['messages']:
            print("First msg keys:", list(ch['messages'][0].keys()))
    else:
        print("No chat_history docs")
    
    client.close()

asyncio.run(debug_trips())

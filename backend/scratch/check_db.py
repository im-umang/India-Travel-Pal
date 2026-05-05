import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os

async def check_db():
    uri = "mongodb://localhost:27017"
    db_name = "india_travel_pal"
    client = AsyncIOMotorClient(uri)
    db = client[db_name]
    
    collections = await db.list_collection_names()
    print(f"Collections: {collections}")
    
    for coll in collections:
        count = await db[coll].count_documents({})
        print(f"Collection {coll} has {count} documents")
        
    # Check sample conversations
    if "conversations" in collections:
        print("\nSample Conversation:")
        async for doc in db.conversations.find().limit(1):
            print(doc)

if __name__ == "__main__":
    asyncio.run(check_db())

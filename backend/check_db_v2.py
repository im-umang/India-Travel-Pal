import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os

async def check():
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client.india_travel_pal
    collections = await db.list_collection_names()
    print(f"Collections: {collections}")
    
    for coll in collections:
        count = await db[coll].count_documents({})
        print(f"Collection {coll} has {count} documents")
        if count > 0:
            doc = await db[coll].find_one()
            # print first 3 fields
            print(f"Sample from {coll}: {dict(list(doc.items())[:3])}")

if __name__ == "__main__":
    asyncio.run(check())

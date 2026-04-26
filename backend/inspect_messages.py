import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os

async def check():
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client.india_travel_pal
    
    # Check chat_history
    chat = await db.chat_history.find_one({"messages": {"$exists": True, "$not": {"$size": 0}}})
    if chat:
        print("Sample message from chat_history:")
        print(chat['messages'][0])
    
    # Check conversations
    conv = await db.conversations.find_one({"messages": {"$exists": True, "$not": {"$size": 0}}})
    if conv:
        print("\nSample message from conversations:")
        print(conv['messages'][0])

if __name__ == "__main__":
    asyncio.run(check())

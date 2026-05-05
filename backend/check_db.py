
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

async def check_db():
    uri = os.getenv("MONGO_URI", "mongodb://localhost:27017")
    client = AsyncIOMotorClient(uri)
    db = client.get_database("india_travel_pal")
    
    conv_count = await db.conversations.count_documents({})
    print(f"Conversations count: {conv_count}")
    
    async for c in db.conversations.find({}).limit(5):
        print(f"Conversation: {c.get('title')} - User: {c.get('user_id')}")
        
    chat_count = await db.chat_history.count_documents({})
    print(f"Chat History count: {chat_count}")
    
    async for ch in db.chat_history.find({}).limit(5):
        print(f"Chat History Session: {ch.get('session_id')} - User: {ch.get('user_id')}")

if __name__ == "__main__":
    asyncio.run(check_db())

import asyncio
import sys
from motor.motor_asyncio import AsyncIOMotorClient

async def test_db():
    try:
        client = AsyncIOMotorClient("mongodb://localhost:27017")
        # Try to ping
        await client.admin.command('ping')
        print("DB: MongoDB is UP")
        
        db = client.india_travel_pal
        user_count = await db.users.count_documents({})
        print(f"DB: Users count: {user_count}")
        
        # Check admin user
        admin = await db.users.find_one({"email": "admin@indiatravelpal.com"})
        if admin:
            print("DB: Admin user found")
        else:
            print("DB: Admin user NOT found")
            
    except Exception as e:
        print(f"DB Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_db())

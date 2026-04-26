"""
MongoDB Database Connection & Collections
Uses Motor (async MongoDB driver)
"""

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.config import settings

# ── Global client & db references ──
client: AsyncIOMotorClient = None
db: AsyncIOMotorDatabase = None


async def connect_database():
    """Connect to MongoDB and create indexes."""
    global client, db

    try:
        client = AsyncIOMotorClient(settings.MONGODB_URI)
        db = client[settings.MONGODB_DB_NAME]

        # Test connection
        print(f"MongoDB connected - Database: {settings.MONGODB_DB_NAME}")

        # Create indexes for performance
        await _create_indexes()

    except Exception as e:
        print(f"MongoDB connection failed: {e}")
        print("   The app will run with in-memory storage as fallback.")
        db = None


async def disconnect_database():
    """Disconnect from MongoDB."""
    global client
    if client:
        client.close()
        print("MongoDB disconnected")


async def _create_indexes():
    """Create database indexes for optimal query performance."""
    if db is None:
        return

    try:
        # Users — unique email, search by role
        await db.users.create_index("email", unique=True)
        await db.users.create_index("role")
        await db.users.create_index("created_at")

        # Trips — query by user, search by destination
        await db.trips.create_index("user_id")
        await db.trips.create_index("destination")
        await db.trips.create_index("created_at")
        await db.trips.create_index([("user_id", 1), ("created_at", -1)])

        # Conversations — query by user, sort by timestamp
        await db.conversations.create_index("user_id")
        await db.conversations.create_index([("user_id", 1), ("updated_at", -1)])
        await db.conversations.create_index("updated_at")

        # Admin logs
        await db.admin_logs.create_index("action")
        await db.admin_logs.create_index("created_at")
        await db.admin_logs.create_index("admin_id")

        # Search Logs (ML Training Data)
        for collection in ["train_search_logs", "flight_search_logs", "bus_search_logs", "hotel_search_logs", "food_search_logs"]:
            await db[collection].create_index("user_id")
            await db[collection].create_index("timestamp")
            await db[collection].create_index("search_query")

        print("Database indexes created")
    except Exception as e:
        print(f"Index creation warning: {e}")


def get_db() -> AsyncIOMotorDatabase:
    """Get database instance. Returns None if not connected."""
    return db

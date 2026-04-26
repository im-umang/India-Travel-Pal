"""
Standalone DB Seed Script
Run this once to populate all MongoDB collections with knowledge base data.
Usage: python seed_db.py   (from the backend folder)
"""
import asyncio
import sys
import os

# Fix Windows console encoding
if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

# Add backend folder to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

async def main():
    print("=" * 55)
    print("   India Travel Pal -- Database Seeder")
    print("=" * 55)

    # Connect
    from app.database import connect_database, get_db
    await connect_database()

    db = get_db()
    if db is None:
        print("[ERROR] Could not connect to MongoDB. Check MONGODB_URI in .env")
        return

    print("[OK] Connected to MongoDB")

    # Seed
    from app.services.knowledge_service import seed_database
    await seed_database(db)

    # Show counts
    print("\n[INFO] Collection document counts after seeding:")
    collections = [
        "hotel_search_logs", "food_search_logs", "flight_search_logs",
        "train_search_logs", "bus_search_logs", "trips"
    ]
    for col in collections:
        count = await db[col].count_documents({})
        status = "[OK]" if count > 0 else "[EMPTY]"
        print(f"   {status} {col}: {count} documents")

    print("\n[DONE] Seeding complete! Refresh MongoDB Compass to see data.")

if __name__ == "__main__":
    asyncio.run(main())

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def fix_admin():
    client = AsyncIOMotorClient('mongodb://localhost:27017')
    db = client['india_travel_pal']
    
    # Update ALL users with admin email to have role=admin
    result = await db.users.update_many(
        {'email': 'admin@indiatravelpal.com'},
        {'$set': {'role': 'admin'}}
    )
    print(f'Updated {result.modified_count} admin users -> role=admin')
    
    # Show all users and their roles
    cursor = db.users.find({}, {'email': 1, 'role': 1, 'name': 1, '_id': 0})
    users = await cursor.to_list(length=50)
    print(f'\nTotal users in DB: {len(users)}')
    for u in users:
        print(f'  {u.get("email")} | role: {u.get("role", "NOT SET")} | name: {u.get("name", u.get("full_name", "?"))}')
    
    client.close()
    print('\nDone!')

asyncio.run(fix_admin())

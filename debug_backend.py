import asyncio
import os
import sys
import logging

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), "backend"))

from app.services.chat_service import ChatService
from app.schemas.chat import Message

logging.basicConfig(level=logging.INFO)

async def debug_chat():
    service = ChatService()
    user_input = "mujhe goa jana hai 3 din ke liye"
    history = []
    
    print("\n--- DEBUG START ---")
    print(f"API Key start: {service.api_key[:10]}...")
    
    try:
        response = await service.active_chat_processing(user_input, history)
        print("\n--- RESPONSE ---")
        print(response)
    except Exception as e:
        print("\n--- FATAL ERROR ---")
        print(e)
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(debug_chat())

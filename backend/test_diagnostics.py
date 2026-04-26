
import asyncio
import os
import sys
from dotenv import load_dotenv

# Add the project root to sys.path
sys.path.append(os.getcwd())

load_dotenv()

from app.services.chat_service import ChatService
from app.schemas.chat import Message

async def test_chat():
    service = ChatService()
    print(f"Testing Gemini API Key: {service.api_key[:10]}...")
    
    user_input = "Abse Hindi mein baat karo"
    history = []
    
    print(f"Calling active_chat_processing with: {user_input}")
    try:
        response = await service.active_chat_processing(user_input, history)
        print("Response received:")
        print(response)
    except Exception as e:
        print(f"Exception occurred in test script: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_chat())

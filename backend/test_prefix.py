import asyncio
import os
from google import genai
from google.genai import types
from dotenv import load_dotenv
import sys

if sys.stdout.encoding != 'utf-8':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

load_dotenv()

async def test_gemini():
    api_key = os.getenv("GEMINI_API_KEY")
    client = genai.Client(api_key=api_key)
    
    # Try with 'models/' prefix
    model = "models/gemini-2.0-flash"
    try:
        print(f"Testing {model}...")
        response = await client.aio.models.generate_content(
            model=model,
            contents="Say 'OK'"
        )
        print(f"Success: {response.text.strip()}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_gemini())

import asyncio
import os
from google import genai
from google.genai import types
from dotenv import load_dotenv
import sys

# Ensure UTF-8 for console output to avoid UnicodeEncodeError on Windows
if sys.stdout.encoding != 'utf-8':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

load_dotenv()

async def test_gemini():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("Error: GEMINI_API_KEY not found in .env")
        return

    print(f"Connecting with key: {api_key[:5]}...{api_key[-5:]}")
    client = genai.Client(api_key=api_key)
    
    models = ["gemini-2.0-flash", "gemini-1.5-flash"]
    
    for model in models:
        try:
            print(f"\nTesting model: {model}...")
            # Note: client.aio.models.generate_content is the correct async method
            response = await client.aio.models.generate_content(
                model=model,
                contents="Say 'Status: OK'"
            )
            if response and response.text:
                print(f"Success ({model}): {response.text.strip()}")
            else:
                print(f"Warning: Response received but no text found from {model}.")
        except Exception as e:
            print(f"EXCEPTION with {model}: {type(e).__name__} - {str(e)}")

if __name__ == "__main__":
    asyncio.run(test_gemini())

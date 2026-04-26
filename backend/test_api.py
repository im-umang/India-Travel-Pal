import asyncio
import os
from google import genai
from google.genai import types

# Load env or mock settings
GEMINI_API_KEY = "REPLACED_WITH_REAL_KEY" # This is a placeholder, actual key should be in settings

async def test_gemini():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("ERROR: GEMINI_API_KEY not found in environment.")
        return

    client = genai.Client(api_key=api_key)
    # Correct models (v1.5)
    models = ["gemini-1.5-flash", "gemini-1.5-pro"]
    
    for m in models:
        print(f"\nTesting model: {m}")
        try:
            response = await client.aio.models.generate_content(
                model=m,
                contents="Say hello!",
                config=types.GenerateContentConfig(
                    max_output_tokens=100,
                    temperature=0.1
                )
            )
            print(f"SUCCESS ({m}): {response.text}")
        except Exception as e:
            print(f"FAILED ({m}): {e}")

if __name__ == "__main__":
    asyncio.run(test_gemini())

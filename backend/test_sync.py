import os
from google import genai
from dotenv import load_dotenv
import sys

# Reset stdout to avoid any buffering issues if possible
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

load_dotenv()

def test_sync():
    api_key = os.getenv("GEMINI_API_KEY")
    print(f"Connecting with key: {api_key[:5]}...")
    client = genai.Client(api_key=api_key)
    
    # Use the first model from the list we saw earlier
    model = "gemini-2.0-flash"
    try:
        print(f"Sync test with {model}...")
        # Note: client.models.generate_content is the SYNC method
        response = client.models.generate_content(
            model=model,
            contents="Say 'Sync OK'"
        )
        if response:
            print(f"Success: {response.text.strip()}")
        else:
            print("Empty response")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_sync()

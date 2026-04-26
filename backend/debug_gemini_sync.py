import os
from google import genai
from dotenv import load_dotenv
import sys

# Ensure UTF-8
if sys.stdout.encoding != 'utf-8':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

load_dotenv()

def debug_sync():
    api_key = os.getenv("GEMINI_API_KEY")
    print(f"DEBUG: Key starts with {api_key[:5]}")
    client = genai.Client(api_key=api_key)
    
    # Try models one by one
    models = ["models/gemini-2.0-flash", "models/gemini-flash-latest", "gemini-2.0-flash"]
    
    for m in models:
        print(f"\n--- Testing Model: {m} ---")
        sys.stdout.flush()
        try:
            # SYNC CALL
            response = client.models.generate_content(
                model=m,
                contents="Aap Chandigarh ke bare mein kya jante hain? (Answer in short)"
            )
            if response and response.text:
                print(f"SUCCESS [{m}]: {response.text.strip()}")
            else:
                print(f"EMPTY RESPONSE [{m}]")
        except Exception as e:
            print(f"ERROR [{m}]: {type(e).__name__} - {str(e)}")
        sys.stdout.flush()

if __name__ == "__main__":
    debug_sync()

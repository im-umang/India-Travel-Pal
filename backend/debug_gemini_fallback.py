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
    client = genai.Client(api_key=api_key)
    
    # Try older models which might have separate quota
    models = ["models/gemini-1.5-flash", "models/gemini-1.5-pro", "models/gemini-1.5-flash-8b", "models/gemini-1.0-pro"]
    
    for m in models:
        print(f"\n--- Testing Model: {m} ---")
        sys.stdout.flush()
        try:
            response = client.models.generate_content(
                model=m,
                contents="Aap Chandigarh ke bare mein kya jante hain?"
            )
            if response and response.text:
                print(f"SUCCESS [{m}]: {response.text.strip()}")
                break # Stop if we find a working one
            else:
                print(f"EMPTY RESPONSE [{m}]")
        except Exception as e:
            print(f"ERROR [{m}]: {type(e).__name__} - {str(e)}")
        sys.stdout.flush()

if __name__ == "__main__":
    debug_sync()

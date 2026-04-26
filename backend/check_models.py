import google.generativeai as genai
from app.core.config import settings
import os

api_key = settings.GEMINI_API_KEY
if not api_key:
    print("API Key not found in settings.")
    exit()

genai.configure(api_key=api_key)

print(f"Using API Key: {api_key[:5]}...{api_key[-5:]}")

try:
    print("Listing available models:")
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(f"- {m.name}")
except Exception as e:
    print(f"Error listing models: {e}")

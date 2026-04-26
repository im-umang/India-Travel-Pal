"""
Centralized Configuration — loaded from environment variables / .env
"""

import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    """Application settings loaded from environment."""

    # Server
    PORT: int = int(os.getenv("PORT", "8000"))
    HOST: str = os.getenv("HOST", "0.0.0.0")
    DEBUG: bool = os.getenv("DEBUG", "true").lower() == "true"

    # MongoDB
    MONGODB_URI: str = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
    MONGODB_DB_NAME: str = os.getenv("MONGODB_DB_NAME", "india_travel_pal")

    # JWT
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "change-this-secret")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))

    # CORS
    CORS_ORIGINS: list = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:8080,http://localhost:8081,http://127.0.0.1:5173,http://127.0.0.1:8080,http://127.0.0.1:8081").split(",")

    # Rate limiting
    RATE_LIMIT_PER_MINUTE: int = int(os.getenv("RATE_LIMIT_PER_MINUTE", "60"))

    # Admin
    ADMIN_EMAIL: str = os.getenv("ADMIN_EMAIL", "admin@indiatravelpal.com")
    ADMIN_PASSWORD: str = os.getenv("ADMIN_PASSWORD", "Admin@123456")

    # External APIs
    RAILWAY_API_KEY: str = os.getenv("RAILWAY_API_KEY", "")
    AMADEUS_API_KEY: str = os.getenv("AMADEUS_API_KEY", "")
    AMADEUS_API_SECRET: str = os.getenv("AMADEUS_API_SECRET", "")
    GOOGLE_PLACES_KEY: str = os.getenv("GOOGLE_PLACES_KEY", "")
    UBER_SERVER_TOKEN: str = os.getenv("UBER_SERVER_TOKEN", "")
    OPENWEATHER_KEY: str = os.getenv("OPENWEATHER_KEY", "")


settings = Settings()
# config updated to reload env changes

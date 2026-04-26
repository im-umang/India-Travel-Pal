from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List, Optional, Any, Union
from pydantic import Field, field_validator
import json

class Settings(BaseSettings):
    """
    Application Settings
    Loads variables from environment or .env file
    """
    model_config = SettingsConfigDict(
        env_file=".env", 
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=True
    )

    # Core
    PROJECT_NAME: str = "India Travel Pal"
    API_V1_STR: str = "/api/v1"
    PORT: int = 8000
    HOST: str = "0.0.0.0"
    DEBUG: bool = True
    LOG_LEVEL: str = "INFO"

    # Database
    MONGODB_URI: str  # Mandatory from .env
    MONGODB_DB_NAME: str = "india_travel_pal"
    
    # Security (JWT)
    JWT_SECRET_KEY: str # Mandatory from .env
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # CORS
    CORS_ORIGINS: Union[str, List[str]] = [
        "http://localhost:5173", 
        "http://localhost:3000", 
        "http://localhost:8080", 
        "http://localhost:8081",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:8080",
        "http://127.0.0.1:8081"
    ]
    
    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, v: Any) -> List[str]:
        if isinstance(v, str):
            if v.strip().startswith("["):
                try:
                    return json.loads(v)
                except json.JSONDecodeError:
                    pass # Fallback to comma split if valid json fails
            return [i.strip() for i in v.split(",")]
        return v

    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60
    
    # Admin
    ADMIN_EMAIL: str = "admin@example.com"
    ADMIN_PASSWORD: str = "admin"

    # OpenAI / AI Services
    OPENAI_API_KEY: Optional[str] = None
    MISTRAL_API_KEY: Optional[str] = None
    GEMINI_API_KEY: Optional[str] = None
    
    # Computed / Aliased Properties for Backward Compatibility
    @property
    def MONGODB_URL(self) -> str:
        return self.MONGODB_URI

    @property
    def DB_NAME(self) -> str:
        return self.MONGODB_DB_NAME

    @property
    def SECRET_KEY(self) -> str:
        return self.JWT_SECRET_KEY

    @property
    def ALGORITHM(self) -> str:
        return self.JWT_ALGORITHM
    
    @property
    def ACCESS_TOKEN_EXPIRE_MINUTES(self) -> int:
        return self.JWT_ACCESS_TOKEN_EXPIRE_MINUTES

settings = Settings()

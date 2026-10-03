import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

class Settings(BaseSettings):
    APP_NAME: str = "LeakLens"
    APP_VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    DATA_SOURCE_MODE: str = "demo"  # "demo" or "external"
    
    # Database: Default to SQLite for instant out-of-the-box running,
    # Can be overridden by DATABASE_URL (e.g. postgresql://user:pass@localhost:5432/leaklens)
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./leaklens.db")
    
    # External Provider Config (Optional)
    EXTERNAL_API_BASE_URL: str = os.getenv("EXTERNAL_API_BASE_URL", "")
    EXTERNAL_API_KEY: str = os.getenv("EXTERNAL_API_KEY", "")
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "*"
    ]
    
    # Security & Privacy (Server-side HMAC secret)
    SECRET_KEY: str = os.getenv("SECRET_KEY", "leaklens_defensive_cyber_secret_key_2026")

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()

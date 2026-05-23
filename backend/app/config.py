from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List
from functools import lru_cache

class Settings(BaseSettings):
    APP_NAME: str = "Salary Management API"
    DEBUG: bool = False
    DATABASE_URL: str
    CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000"]
    
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

@lru_cache
def get_settings() -> Settings:
    return Settings()

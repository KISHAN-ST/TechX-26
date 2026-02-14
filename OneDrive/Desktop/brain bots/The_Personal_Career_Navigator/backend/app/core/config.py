# backend/app/core/config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    REDIS_URL: str
    SECRET_KEY: str
    GITHUB_TOKEN: str = ""
    KAGGLE_DATASET_PATH: str = ""
    
    class Config:
        env_file = ".env"

settings = Settings()
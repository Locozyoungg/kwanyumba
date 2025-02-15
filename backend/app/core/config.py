# File Location: backend/app/core/config.py
# Description: Configuration settings for Kwanyumba.

from pydantic import BaseSettings

class Settings(BaseSettings):
    # General settings
    APP_NAME: str = "Kwanyumba"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = "API for Kwanyumba Rental Platform"

    # Database settings
    DATABASE_URL: str = "postgresql://user:password@localhost/kwanyumba_db"

    # Security settings
    SECRET_KEY: str = "your_secret_key_here"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60  # Token expires in 60 minutes

    class Config:
        env_file = ".env"  # Load environment variables from a .env file

# Create settings instance
settings = Settings()

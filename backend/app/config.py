from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    ALLOWED_ORIGINS: str = "*"
    DEBUG: bool = False

    class Config:
        env_file = ".env"

settings = Settings()

import os

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    env: str = "dev"
    debug: bool = True
    api_prefix: str = "/api"
    log_level: str = "debug"
    cors_origins: list[str] = ["*"]

    model_config = SettingsConfigDict(env_file=".env.prod" if os.getenv("ENV") == "PROD" else ".env")

settings = Settings()

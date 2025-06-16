from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    env: str = "dev"
    debug: bool = True
    api_prefix: str = "/api"
    log_level: str = "debug"
    allowed_origins: list[str] = ["*"]

    class Config:
        env_file = ".env"

settings = Settings()

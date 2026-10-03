from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    groq_api_key:     str
    gnews_api_key:    str
    groq_model:       str = "openai/gpt-oss-20b"
    allowed_origins:  str = "http://localhost:5200"
    environment:      str = "development"

    class Config:
        env_file = ".env"
        extra    = "ignore"

    def get_origins(self) -> list[str]:
        return [o.strip() for o in self.allowed_origins.split(",")]

@lru_cache
def get_settings() -> Settings:
    return Settings()
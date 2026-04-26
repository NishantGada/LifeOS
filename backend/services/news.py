import httpx
import os
import time
from dotenv import load_dotenv

load_dotenv()

GNEWS_KEY = os.getenv("GNEWS_API_KEY")
GNEWS_URL = "https://gnews.io/api/v4/top-headlines"
CACHE_TTL = 60 * 30  # 30 minutes

_raw_cache:       dict = {"data": None, "timestamp": 0}
_processed_cache: dict = {"data": None, "timestamp": 0}

async def fetch_top_news(force: bool = False) -> list[dict]:
    now = time.time()
    if not force and _raw_cache["data"] and (now - _raw_cache["timestamp"]) < CACHE_TTL:
        return _raw_cache["data"]

    async with httpx.AsyncClient() as client:
        res = await client.get(GNEWS_URL, params={
            "token":   GNEWS_KEY,
            "lang":    "en",
            "country": "us",
            "max":     10,
            "topic":   "world",
        })
        data = res.json()

    articles = data.get("articles", [])[:10]
    _raw_cache["data"]      = articles
    _raw_cache["timestamp"] = now
    return articles

def get_processed_cache() -> list | None:
    now = time.time()
    if _processed_cache["data"] and (now - _processed_cache["timestamp"]) < CACHE_TTL:
        return _processed_cache["data"]
    return None

def set_processed_cache(articles: list) -> None:
    _processed_cache["data"]      = articles
    _processed_cache["timestamp"] = time.time()
from fastapi import APIRouter, Query
from services.news    import fetch_top_news, get_processed_cache, set_processed_cache
from services.news_ai import summarize_article
from models.news      import Article
import asyncio

router = APIRouter(prefix="/news", tags=["news"])

def time_ago(published: str) -> str:
    from datetime import datetime, timezone
    try:
        dt   = datetime.fromisoformat(published.replace("Z", "+00:00"))
        now  = datetime.now(timezone.utc)
        diff = int((now - dt).total_seconds())
        if diff < 3600:  return f"{diff // 60}m ago"
        if diff < 86400: return f"{diff // 3600}h ago"
        return f"{diff // 86400}d ago"
    except Exception:
        return published

@router.get("", response_model=list[Article])
async def get_news(force: bool = Query(False)):
    if not force:
        cached = get_processed_cache()
        if cached:
            return cached

    raw = await fetch_top_news(force=force)

    async def process(a: dict) -> Article:
        description = a.get("description") or a.get("title", "")
        summary     = await summarize_article(a["title"], description)
        return Article(
            title     = a["title"],
            summary   = summary,
            source    = a.get("source", {}).get("name", "Unknown"),
            url       = a["url"],
            published = time_ago(a["publishedAt"]),
            image     = a.get("image"),
        )

    articles = list(await asyncio.gather(*[process(a) for a in raw[:5]]))
    set_processed_cache([a.model_dump() for a in articles])
    return articles
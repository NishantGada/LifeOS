import pytest
from httpx import AsyncClient, ASGITransport
from main import app
from database import init_db

@pytest.mark.asyncio
async def test_get_news():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        res = await client.get("/news")
        assert res.status_code == 200
        articles = res.json()
        assert len(articles) == 5
        for a in articles:
            assert "title"     in a
            assert "summary"   in a
            assert "source"    in a
            assert "url"       in a
            assert "published" in a

@pytest.mark.asyncio
async def test_news_cached():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        res1 = await client.get("/news")
        res2 = await client.get("/news")
        assert res1.json() == res2.json()
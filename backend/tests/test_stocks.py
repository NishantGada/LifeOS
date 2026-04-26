import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from main import app
from database import init_db

@pytest_asyncio.fixture(autouse=True)
async def setup_db():
    await init_db()

@pytest.mark.asyncio
async def test_get_stocks():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        res = await client.get("/stocks")
        assert res.status_code == 200
        data = res.json()
        assert "nyse" in data
        assert "bse" in data
        assert "stocks"  in data["nyse"]
        assert "summary" in data["nyse"]
        assert "stocks"  in data["bse"]
        assert "summary" in data["bse"]
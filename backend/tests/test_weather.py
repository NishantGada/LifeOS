import pytest
from httpx import AsyncClient, ASGITransport
from main import app

@pytest.mark.asyncio
async def test_weather_by_city():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        res = await client.get("/weather", params={"city": "London"})
        assert res.status_code == 200
        data = res.json()
        assert "current" in data
        assert "forecast" in data
        assert len(data["forecast"]) == 5
        assert "summary" in data

@pytest.mark.asyncio
async def test_weather_by_coords():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        res = await client.get("/weather", params={"lat": 42.36, "lon": -71.06})
        assert res.status_code == 200
        assert res.json()["current"]["temp"] is not None

@pytest.mark.asyncio
async def test_weather_city_not_found():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        res = await client.get("/weather", params={"city": "xyznotacity12345"})
        assert res.status_code == 404
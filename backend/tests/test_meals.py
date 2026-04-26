import pytest
from httpx import AsyncClient, ASGITransport
from main import app

@pytest.mark.asyncio
async def test_generate_meals_default():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        res = await client.post("/meals", json={})
        assert res.status_code == 200
        data = res.json()
        assert "meals" in data
        assert len(data["meals"]) == 3
        for meal in data["meals"]:
            assert "name"               in meal
            assert "ingredients"        in meal
            assert "steps"              in meal
            assert "time_minutes"       in meal
            assert "estimated_cost_inr" in meal

@pytest.mark.asyncio
async def test_generate_meals_with_prompt():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        res = await client.post("/meals", json={
            "prompt": "something with paneer",
            "max_time": 20,
            "max_budget": 100,
        })
        assert res.status_code == 200
        assert len(res.json()["meals"]) == 3
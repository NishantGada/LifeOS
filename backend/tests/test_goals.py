import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from main import app
from database import init_db

@pytest_asyncio.fixture(autouse=True)
async def setup_db():
    await init_db()

@pytest.mark.asyncio
async def test_create_and_get_goal():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        res = await client.post("/goals", json={
            "title": "Get a full-time job",
            "category": "Work",
            "target_date": "2025-07-01"
        })
        assert res.status_code == 200
        data = res.json()
        assert data["title"] == "Get a full-time job"
        assert data["progress"] == 0
        assert data["milestones"] == []

@pytest.mark.asyncio
async def test_update_progress():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        res = await client.post("/goals", json={"title": "Learn Japanese"})
        goal_id = res.json()["id"]
        res2 = await client.patch(f"/goals/{goal_id}", json={"progress": 40})
        assert res2.json()["progress"] == 40

@pytest.mark.asyncio
async def test_add_and_toggle_milestone():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        res = await client.post("/goals", json={"title": "Hit 75kg"})
        goal_id = res.json()["id"]

        ms = await client.post(f"/goals/{goal_id}/milestones", json={"title": "Track calories for 2 weeks"})
        ms_id = ms.json()["id"]
        assert ms.json()["completed"] == False

        toggled = await client.patch(f"/goals/{goal_id}/milestones/{ms_id}")
        assert toggled.json()["completed"] == True

@pytest.mark.asyncio
async def test_delete_goal():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        res = await client.post("/goals", json={"title": "To be deleted"})
        goal_id = res.json()["id"]
        await client.delete(f"/goals/{goal_id}")
        all_goals = await client.get("/goals")
        assert not any(g["id"] == goal_id for g in all_goals.json())
import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from main import app
from database import init_db

@pytest_asyncio.fixture(autouse=True)
async def setup_db():
    await init_db()

@pytest.mark.asyncio
async def test_create_and_get_todo():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        res = await client.post("/todos", json={"title": "Test task", "priority": "high"})
        assert res.status_code == 200
        data = res.json()
        assert data["title"] == "Test task"
        assert data["priority"] == "high"
        assert data["completed"] == False

        res2 = await client.get("/todos")
        assert any(t["title"] == "Test task" for t in res2.json())

@pytest.mark.asyncio
async def test_toggle_complete():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        res = await client.post("/todos", json={"title": "Toggle me"})
        todo_id = res.json()["id"]
        res2 = await client.patch(f"/todos/{todo_id}", json={"completed": True})
        assert res2.json()["completed"] == True

@pytest.mark.asyncio
async def test_delete_todo():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        res = await client.post("/todos", json={"title": "Delete me"})
        todo_id = res.json()["id"]
        await client.delete(f"/todos/{todo_id}")
        res2 = await client.get("/todos")
        assert not any(t["id"] == todo_id for t in res2.json())
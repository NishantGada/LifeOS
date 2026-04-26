from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from database import init_db
from config import get_settings
from routers import todos, weather, news, stocks, meals, goals

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield

settings = get_settings()

app = FastAPI(
    title="Personal Dashboard API",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs" if settings.environment == "development" else None,
    redoc_url=None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.get_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(todos.router)
app.include_router(weather.router)
app.include_router(news.router)
app.include_router(stocks.router)
app.include_router(meals.router)
app.include_router(goals.router)

@app.get("/health")
def health():
    return {"status": "ok", "environment": settings.environment}
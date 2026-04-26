import aiosqlite
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "dashboard.db")

async def get_db():
    async with aiosqlite.connect(DB_PATH) as db:
        yield db

async def init_db():
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute("""
            CREATE TABLE IF NOT EXISTS todos (
                id          INTEGER PRIMARY KEY AUTOINCREMENT,
                title       TEXT    NOT NULL,
                notes       TEXT    DEFAULT '',
                priority    TEXT    DEFAULT 'medium',
                category    TEXT    DEFAULT 'Personal',
                due_date    TEXT    DEFAULT NULL,
                completed   INTEGER DEFAULT 0,
                created_at  TEXT    DEFAULT (datetime('now'))
            )
        """)
        await db.commit()
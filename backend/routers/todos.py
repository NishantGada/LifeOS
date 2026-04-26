from fastapi import APIRouter, Depends, HTTPException
from typing import List
import aiosqlite

from database import get_db
from models.todo import TodoCreate, TodoUpdate, TodoResponse, AIParseRequest
from services.llm import parse_todo_with_ai

router = APIRouter(prefix="/todos", tags=["todos"])

def row_to_todo(row) -> TodoResponse:
    return TodoResponse(
        id         = row[0],
        title      = row[1],
        notes      = row[2] or "",
        priority   = row[3],
        category   = row[4],
        due_date   = row[5],
        completed  = bool(row[6]),
        created_at = row[7],
    )

@router.get("", response_model=List[TodoResponse])
async def get_todos(db: aiosqlite.Connection = Depends(get_db)):
    async with db.execute(
        "SELECT id, title, notes, priority, category, due_date, completed, created_at FROM todos ORDER BY created_at DESC"
    ) as cursor:
        rows = await cursor.fetchall()
    return [row_to_todo(r) for r in rows]

@router.post("", response_model=TodoResponse)
async def create_todo(todo: TodoCreate, db: aiosqlite.Connection = Depends(get_db)):
    async with db.execute(
        "INSERT INTO todos (title, notes, priority, category, due_date) VALUES (?, ?, ?, ?, ?)",
        (todo.title, todo.notes, todo.priority, todo.category, todo.due_date)
    ) as cursor:
        todo_id = cursor.lastrowid
    await db.commit()
    async with db.execute(
        "SELECT id, title, notes, priority, category, due_date, completed, created_at FROM todos WHERE id = ?",
        (todo_id,)
    ) as cursor:
        row = await cursor.fetchone()
    return row_to_todo(row)

@router.patch("/{todo_id}", response_model=TodoResponse)
async def update_todo(todo_id: int, update: TodoUpdate, db: aiosqlite.Connection = Depends(get_db)):
    fields, values = [], []
    for field, val in update.model_dump(exclude_none=True).items():
        fields.append(f"{field} = ?")
        values.append(int(val) if field == "completed" else val)
    if not fields:
        raise HTTPException(status_code=400, detail="No fields to update")
    values.append(todo_id)
    await db.execute(f"UPDATE todos SET {', '.join(fields)} WHERE id = ?", values)
    await db.commit()
    async with db.execute(
        "SELECT id, title, notes, priority, category, due_date, completed, created_at FROM todos WHERE id = ?",
        (todo_id,)
    ) as cursor:
        row = await cursor.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Todo not found")
    return row_to_todo(row)

@router.delete("/{todo_id}")
async def delete_todo(todo_id: int, db: aiosqlite.Connection = Depends(get_db)):
    await db.execute("DELETE FROM todos WHERE id = ?", (todo_id,))
    await db.commit()
    return {"deleted": todo_id}

@router.post("/ai-parse")
async def ai_parse(req: AIParseRequest):
    result = await parse_todo_with_ai(req.text)
    return result
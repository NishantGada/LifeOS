from fastapi import APIRouter, Depends, HTTPException
from typing import List
import aiosqlite

from database import get_db
from models.goals import (
    GoalCreate, GoalUpdate, GoalResponse,
    MilestoneCreate, MilestoneResponse,
    AIActionPlanRequest,
)
from services.goals_ai import generate_action_plan

router = APIRouter(prefix="/goals", tags=["goals"])

async def fetch_goal(goal_id: int, db: aiosqlite.Connection) -> GoalResponse:
    async with db.execute(
        "SELECT id, title, description, category, target_date, progress, created_at FROM goals WHERE id = ?",
        (goal_id,)
    ) as cur:
        row = await cur.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Goal not found")

    async with db.execute(
        "SELECT id, goal_id, title, completed FROM milestones WHERE goal_id = ?",
        (goal_id,)
    ) as cur:
        ms = await cur.fetchall()

    return GoalResponse(
        id          = row[0],
        title       = row[1],
        description = row[2] or "",
        category    = row[3],
        target_date = row[4],
        progress    = row[5],
        created_at  = row[6],
        milestones  = [
            MilestoneResponse(id=m[0], goal_id=m[1], title=m[2], completed=bool(m[3]))
            for m in ms
        ],
    )

@router.get("", response_model=List[GoalResponse])
async def get_goals(db: aiosqlite.Connection = Depends(get_db)):
    async with db.execute(
        "SELECT id FROM goals ORDER BY created_at DESC"
    ) as cur:
        rows = await cur.fetchall()
    return [await fetch_goal(r[0], db) for r in rows]

@router.post("", response_model=GoalResponse)
async def create_goal(goal: GoalCreate, db: aiosqlite.Connection = Depends(get_db)):
    async with db.execute(
        "INSERT INTO goals (title, description, category, target_date) VALUES (?, ?, ?, ?)",
        (goal.title, goal.description, goal.category, goal.target_date)
    ) as cur:
        goal_id = cur.lastrowid
    await db.commit()
    return await fetch_goal(goal_id, db)

@router.patch("/{goal_id}", response_model=GoalResponse)
async def update_goal(goal_id: int, update: GoalUpdate, db: aiosqlite.Connection = Depends(get_db)):
    fields, values = [], []
    for field, val in update.model_dump(exclude_none=True).items():
        fields.append(f"{field} = ?")
        values.append(val)
    if not fields:
        raise HTTPException(status_code=400, detail="No fields to update")
    values.append(goal_id)
    await db.execute(f"UPDATE goals SET {', '.join(fields)} WHERE id = ?", values)
    await db.commit()
    return await fetch_goal(goal_id, db)

@router.delete("/{goal_id}")
async def delete_goal(goal_id: int, db: aiosqlite.Connection = Depends(get_db)):
    await db.execute("DELETE FROM goals WHERE id = ?", (goal_id,))
    await db.commit()
    return {"deleted": goal_id}

@router.post("/{goal_id}/milestones", response_model=MilestoneResponse)
async def add_milestone(
    goal_id: int,
    ms: MilestoneCreate,
    db: aiosqlite.Connection = Depends(get_db)
):
    async with db.execute(
        "INSERT INTO milestones (goal_id, title) VALUES (?, ?)",
        (goal_id, ms.title)
    ) as cur:
        ms_id = cur.lastrowid
    await db.commit()
    return MilestoneResponse(id=ms_id, goal_id=goal_id, title=ms.title, completed=False)

@router.patch("/{goal_id}/milestones/{ms_id}", response_model=MilestoneResponse)
async def toggle_milestone(
    goal_id: int,
    ms_id: int,
    db: aiosqlite.Connection = Depends(get_db)
):
    async with db.execute(
        "SELECT id, goal_id, title, completed FROM milestones WHERE id = ? AND goal_id = ?",
        (ms_id, goal_id)
    ) as cur:
        row = await cur.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Milestone not found")
    new_val = 0 if row[3] else 1
    await db.execute("UPDATE milestones SET completed = ? WHERE id = ?", (new_val, ms_id))
    await db.commit()
    return MilestoneResponse(id=row[0], goal_id=row[1], title=row[2], completed=bool(new_val))

@router.delete("/{goal_id}/milestones/{ms_id}")
async def delete_milestone(
    goal_id: int,
    ms_id: int,
    db: aiosqlite.Connection = Depends(get_db)
):
    await db.execute(
        "DELETE FROM milestones WHERE id = ? AND goal_id = ?",
        (ms_id, goal_id)
    )
    await db.commit()
    return {"deleted": ms_id}

@router.post("/action-plan")
async def get_action_plan(req: AIActionPlanRequest, db: aiosqlite.Connection = Depends(get_db)):
    goal = await fetch_goal(req.goal_id, db)
    plan = await generate_action_plan(
        title       = goal.title,
        description = goal.description,
        progress    = goal.progress,
        target_date = goal.target_date,
    )
    return {"plan": plan}
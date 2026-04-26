from pydantic import BaseModel
from typing import Optional

class MilestoneCreate(BaseModel):
    title: str

class MilestoneResponse(BaseModel):
    id:        int
    goal_id:   int
    title:     str
    completed: bool

class GoalCreate(BaseModel):
    title:       str
    description: Optional[str] = ""
    category:    Optional[str] = "Personal"
    target_date: Optional[str] = None

class GoalUpdate(BaseModel):
    title:       Optional[str] = None
    description: Optional[str] = None
    category:    Optional[str] = None
    target_date: Optional[str] = None
    progress:    Optional[int] = None

class GoalResponse(BaseModel):
    id:          int
    title:       str
    description: str
    category:    str
    target_date: Optional[str]
    progress:    int
    created_at:  str
    milestones:  list[MilestoneResponse] = []

class AIActionPlanRequest(BaseModel):
    goal_id: int
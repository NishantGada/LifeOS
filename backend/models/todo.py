from pydantic import BaseModel
from typing import Optional

class TodoCreate(BaseModel):
    title:    str
    notes:    Optional[str]     = ""
    priority: Optional[str]     = "medium"
    category: Optional[str]     = "Personal"
    due_date: Optional[str]     = None

class TodoUpdate(BaseModel):
    title:     Optional[str]    = None
    notes:     Optional[str]    = None
    priority:  Optional[str]    = None
    category:  Optional[str]    = None
    due_date:  Optional[str]    = None
    completed: Optional[bool]   = None

class TodoResponse(BaseModel):
    id:         int
    title:      str
    notes:      str
    priority:   str
    category:   str
    due_date:   Optional[str]
    completed:  bool
    created_at: str

class AIParseRequest(BaseModel):
    text: str
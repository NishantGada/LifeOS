from pydantic import BaseModel
from typing import Optional

class MealRequest(BaseModel):
    prompt:      Optional[str] = None
    max_time:    Optional[int] = 30    # minutes
    max_budget:  Optional[int] = 150   # INR
    num_meals:   Optional[int] = 3
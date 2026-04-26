from fastapi import APIRouter
from models.meals      import MealRequest
from services.meals_ai import generate_meals

router = APIRouter(prefix="/meals", tags=["meals"])

@router.post("")
async def get_meals(req: MealRequest):
    meals = await generate_meals(
        prompt     = req.prompt,
        max_time   = req.max_time   or 30,
        max_budget = req.max_budget or 150,
        num_meals  = req.num_meals  or 3,
    )
    return {"meals": meals}
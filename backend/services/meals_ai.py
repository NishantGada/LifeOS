import json
from services.llm import call_llm
from datetime import date

async def generate_meals(
    prompt: str | None,
    max_time: int,
    max_budget: int,
    num_meals: int,
) -> list[dict]:
    user_context = prompt or "surprise me with something interesting"

    llm_prompt = f"""
Generate exactly {num_meals} vegetarian and eggless meal ideas.
Context from user: "{user_context}"
Constraints: ready in under {max_time} minutes, ingredients cost under ₹{max_budget}.

Return ONLY a valid JSON array. No markdown, no backticks, no explanation.

Each meal must follow this exact shape:
{{
  "name": "meal name",
  "description": "one appetizing sentence",
  "time_minutes": 20,
  "estimated_cost_inr": 80,
  "ingredients": ["ingredient 1 with quantity", "ingredient 2 with quantity"],
  "steps": ["step 1", "step 2", "step 3"],
  "tags": ["quick", "high-protein"] 
}}

Rules:
- All meals must be vegetarian and completely eggless
- Be specific with ingredient quantities
- Keep steps concise but clear — 3 to 6 steps max
- tags can include: quick, high-protein, light, filling, spicy, mild, budget, one-pot
- Vary the meals — don't suggest similar dishes
"""
    raw = call_llm(llm_prompt)
    raw = raw.replace("```json", "").replace("```", "").strip()
    return json.loads(raw)
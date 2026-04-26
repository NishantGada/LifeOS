from services.llm import call_llm

async def generate_action_plan(
    title: str,
    description: str,
    progress: int,
    target_date: str | None,
) -> str:
    deadline = f"Target date: {target_date}." if target_date else "No specific deadline set."
    prompt = f"""
Create a concise weekly action plan for this goal.

Goal: {title}
Description: {description or "No description provided."}
Current progress: {progress}%
{deadline}

Format your response as a clean list of 5 to 7 specific, actionable tasks for this week.
Each task should start with a verb. Be concrete and realistic.
No preamble, no headers, just the numbered list.
"""
    return call_llm(prompt).strip()
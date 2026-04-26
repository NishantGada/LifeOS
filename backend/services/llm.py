import os
import json
from groq import Groq
from dotenv import load_dotenv
from config import get_settings

load_dotenv()
settings = get_settings()
client   = Groq(api_key=settings.groq_api_key)

def call_llm(prompt: str) -> str:
    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
    )
    return response.choices[0].message.content.strip()

async def parse_todo_with_ai(text: str) -> dict:
    prompt = f"""
Extract task details from this natural language input and return ONLY a valid JSON object.
No markdown, no backticks, no explanation — raw JSON only.

Input: "{text}"

Return this exact shape:
{{
  "title":    "concise task title",
  "notes":    "any extra context or empty string",
  "priority": "low" | "medium" | "high",
  "category": "Work" | "Personal" | "Learning" | "Health",
  "due_date": "YYYY-MM-DD or null"
}}

Rules:
- priority: infer from urgency words (urgent/asap/today = high, soon/this week = medium, else low)
- category: infer from context (interview/job/code = Work, gym/diet = Health, study/learn = Learning, else Personal)
- due_date: resolve relative dates like "friday" or "next week" to actual dates based on today being {__import__('datetime').date.today()}
- title: clean and concise, remove filler words
"""
    raw = call_llm(prompt)
    raw = raw.replace("```json", "").replace("```", "").strip()
    return json.loads(raw)
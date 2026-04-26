from services.llm import call_llm

async def summarize_article(title: str, description: str) -> str:
    prompt = f"""
Summarize this news article in exactly one crisp, neutral sentence under 20 words.
No quotes, no preamble, just the sentence.

Title: {title}
Description: {description}
"""
    return call_llm(prompt).strip()
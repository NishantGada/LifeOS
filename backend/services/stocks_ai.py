from services.llm import call_llm

async def summarize_market(exchange: str, stocks: list[dict]) -> str:
    if not stocks:
        return "No data available for this exchange."

    top = stocks[0]
    gainers = ", ".join(
        f"{s['symbol']} +{s['change_pct']}%" for s in stocks[:3]
    )
    prompt = f"""
Write one short, punchy sentence summarizing today's top gainers on {exchange}.
Top gainers: {gainers}. Best performer: {top['symbol']} up {top['change_pct']}%.
Be concise and factual. No quotes, no preamble.
"""
    return call_llm(prompt).strip()
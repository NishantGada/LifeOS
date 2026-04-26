from fastapi import APIRouter, Query
from datetime import datetime, timezone
from services.stocks    import get_stocks
from services.stocks_ai import summarize_market
from models.stocks      import Stock, ExchangeData

router = APIRouter(prefix="/stocks", tags=["stocks"])

@router.get("", response_model=dict)
async def get_stock_data(force: bool = Query(False)):
    data = await get_stocks(force=force)

    nyse_stocks = [Stock(**s) for s in (data["nyse"] or [])]
    bse_stocks  = [Stock(**s) for s in (data["bse"]  or [])]

    nyse_summary = await summarize_market("NYSE", data["nyse"] or [])
    bse_summary  = await summarize_market("BSE",  data["bse"]  or [])

    as_of = datetime.fromtimestamp(data["timestamp"], tz=timezone.utc).strftime("%I:%M %p UTC")

    return {
        "nyse": ExchangeData(
            exchange="NYSE",
            stocks=nyse_stocks,
            summary=nyse_summary,
            as_of=as_of,
        ).model_dump(),
        "bse": ExchangeData(
            exchange="BSE",
            stocks=bse_stocks,
            summary=bse_summary,
            as_of=as_of,
        ).model_dump(),
    }
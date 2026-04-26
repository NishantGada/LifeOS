import yfinance as yf
import time
from datetime import datetime

CACHE_TTL = 60 * 15  # 15 minutes

# Top 30 NYSE/NASDAQ stocks to scan for gainers
NYSE_SYMBOLS = [
    "AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "META", "TSLA", "BRK-B",
    "JPM", "JNJ", "V", "PG", "MA", "HD", "CVX", "MRK", "ABBV", "PEP",
    "KO", "AVGO", "COST", "MCD", "WMT", "DIS", "NFLX", "AMD", "INTC",
    "CRM", "ORCL", "IBM",
]

# Top 20 BSE stocks to scan for gainers
BSE_SYMBOLS = [
    "RELIANCE.BO", "TCS.BO", "HDFCBANK.BO", "INFY.BO", "ICICIBANK.BO",
    "HINDUNILVR.BO", "SBIN.BO", "BAJFINANCE.BO", "BHARTIARTL.BO", "KOTAKBANK.BO",
    "LT.BO", "HCLTECH.BO", "ASIANPAINT.BO", "AXISBANK.BO", "MARUTI.BO",
    "SUNPHARMA.BO", "TITAN.BO", "WIPRO.BO", "ULTRACEMCO.BO", "NESTLEIND.BO",
]

_cache: dict = {"nyse": None, "bse": None, "timestamp": 0}

def format_volume(vol) -> str:
    try:
        v = int(vol)
        if v >= 1_000_000_000: return f"{v/1_000_000_000:.1f}B"
        if v >= 1_000_000:     return f"{v/1_000_000:.1f}M"
        if v >= 1_000:         return f"{v/1_000:.1f}K"
        return str(v)
    except Exception:
        return "N/A"

def fetch_gainers(symbols: list[str], top_n: int = 5) -> list[dict]:
    tickers = yf.Tickers(" ".join(symbols))
    results = []

    for symbol in symbols:
        try:
            t    = tickers.tickers[symbol]
            info = t.fast_info
            prev = info.previous_close
            curr = info.last_price
            if not prev or not curr or prev == 0:
                continue
            change     = curr - prev
            change_pct = (change / prev) * 100
            results.append({
                "symbol":     symbol.replace("-", "."),
                "name":       symbol.replace("-", "."),
                "price":      round(curr, 2),
                "change":     round(change, 2),
                "change_pct": round(change_pct, 2),
                "volume":     format_volume(info.three_month_average_volume),
                "high":       round(info.day_high or curr, 2),
                "low":        round(info.day_low  or curr, 2),
            })
        except Exception:
            continue

    results.sort(key=lambda x: x["change_pct"], reverse=True)
    return results[:top_n]

async def get_stocks(force: bool = False) -> dict:
    now = time.time()
    if not force and _cache["nyse"] and (now - _cache["timestamp"]) < CACHE_TTL:
        return _cache

    nyse = fetch_gainers(NYSE_SYMBOLS)
    bse  = fetch_gainers(BSE_SYMBOLS)

    _cache["nyse"]      = nyse
    _cache["bse"]       = bse
    _cache["timestamp"] = now
    return _cache
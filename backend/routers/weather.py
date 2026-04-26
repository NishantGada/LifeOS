from fastapi import APIRouter, HTTPException, Query
from typing import Optional

from services.weather    import fetch_weather, geocode_city
from services.weather_ai import summarize_weather, wmo_to_description, wmo_to_emoji

router = APIRouter(prefix="/weather", tags=["weather"])

@router.get("")
async def get_weather(
    lat:  Optional[float] = Query(None),
    lon:  Optional[float] = Query(None),
    city: Optional[str]   = Query(None),
):
    # Resolve coordinates
    city_name = city or "your location"
    if city:
        try:
            geo = await geocode_city(city)
            lat, lon, city_name = geo["lat"], geo["lon"], f"{geo['city']}, {geo['country']}"
        except ValueError as e:
            raise HTTPException(status_code=404, detail=str(e))
    elif lat is None or lon is None:
        raise HTTPException(status_code=400, detail="Provide lat/lon or city")

    data    = await fetch_weather(lat, lon)
    current = data["current"]
    daily   = data["daily"]

    summary = await summarize_weather(city_name, current, daily)

    # Build 5-day forecast (skip index 0 = today)
    forecast = []
    for i in range(1, 15):
        forecast.append({
            "date":       daily["time"][i],
            "max":        daily["temperature_2m_max"][i],
            "min":        daily["temperature_2m_min"][i],
            "rain_pct":   daily["precipitation_probability_max"][i],
            "emoji":      wmo_to_emoji(daily["weather_code"][i]),
            "description":wmo_to_description(daily["weather_code"][i]),
        })

    return {
        "city":    city_name,
        "current": {
            "temp":        current["temperature_2m"],
            "feels_like":  current["apparent_temperature"],
            "humidity":    current["relative_humidity_2m"],
            "wind_kmh":    current["wind_speed_10m"],
            "uv_index":    current["uv_index"],
            "emoji":       wmo_to_emoji(current["weather_code"]),
            "description": wmo_to_description(current["weather_code"]),
        },
        "summary":  summary,
        "forecast": forecast,
    }
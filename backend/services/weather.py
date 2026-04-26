import httpx

GEOCODE_URL  = "https://geocoding-api.open-meteo.com/v1/search"
WEATHER_URL  = "https://api.open-meteo.com/v1/forecast"

async def geocode_city(city: str) -> dict:
    async with httpx.AsyncClient() as client:
        res = await client.get(GEOCODE_URL, params={
            "name": city, "count": 1, "language": "en", "format": "json"
        })
        data = res.json()
        if not data.get("results"):
            raise ValueError(f"City '{city}' not found")
        r = data["results"][0]
        return {"lat": r["latitude"], "lon": r["longitude"], "city": r["name"], "country": r["country"]}

async def fetch_weather(lat: float, lon: float) -> dict:
    async with httpx.AsyncClient() as client:
        res = await client.get(WEATHER_URL, params={
            "latitude":                  lat,
            "longitude":                 lon,
            "current":                   "temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code,uv_index",
            "daily":                     "temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max",
            "temperature_unit":          "celsius",
            "wind_speed_unit":           "kmh",
            "forecast_days":             16,
            "timezone":                  "auto",
        })
        return res.json()
from services.llm import call_llm

WMO_DESCRIPTIONS = {
    0: "clear sky", 1: "mainly clear", 2: "partly cloudy", 3: "overcast",
    45: "foggy", 48: "icy fog",
    51: "light drizzle", 53: "moderate drizzle", 55: "dense drizzle",
    61: "slight rain", 63: "moderate rain", 65: "heavy rain",
    71: "slight snow", 73: "moderate snow", 75: "heavy snow",
    80: "slight showers", 81: "moderate showers", 82: "violent showers",
    95: "thunderstorm", 96: "thunderstorm with hail",
}

def wmo_to_description(code: int) -> str:
    return WMO_DESCRIPTIONS.get(code, "unknown conditions")

def wmo_to_emoji(code: int) -> str:
    if code == 0:            return "☀️"
    if code in (1, 2):       return "🌤"
    if code == 3:            return "☁️"
    if code in (45, 48):     return "🌫"
    if code in range(51,66): return "🌧"
    if code in range(71,78): return "❄️"
    if code in range(80,83): return "🌦"
    if code in (95, 96):     return "⛈"
    return "🌡"

async def summarize_weather(city: str, current: dict, daily: dict) -> str:
    code    = current["weather_code"]
    desc    = wmo_to_description(code)
    temp    = current["temperature_2m"]
    feels   = current["apparent_temperature"]
    humidity= current["relative_humidity_2m"]
    wind    = current["wind_speed_10m"]
    max_t   = daily["temperature_2m_max"][0]
    min_t   = daily["temperature_2m_min"][0]
    rain_pct= daily["precipitation_probability_max"][0]

    prompt = f"""
Write a single, natural, conversational sentence summarizing today's weather in {city}.
Facts: {desc}, {temp}°C (feels {feels}°C), humidity {humidity}%, wind {wind} km/h, high {max_t}°C low {min_t}°C, {rain_pct}% chance of rain.
Be concise, human, and slightly poetic. No lists. Just one sentence. No quotation marks.
"""
    return call_llm(prompt)
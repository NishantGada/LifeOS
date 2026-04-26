from pydantic import BaseModel
from typing import Optional

class WeatherRequest(BaseModel):
    lat: float
    lon: float
    city: Optional[str] = None

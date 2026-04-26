import axios from "axios"

const BASE = "http://localhost:8000"

export interface WeatherCurrent {
  temp:        number
  feels_like:  number
  humidity:    number
  wind_kmh:    number
  uv_index:    number
  emoji:       string
  description: string
}

export interface ForecastDay {
  date:        string
  max:         number
  min:         number
  rain_pct:    number
  emoji:       string
  description: string
}

export interface WeatherData {
  city:     string
  current:  WeatherCurrent
  summary:  string
  forecast: ForecastDay[]
}

export const weatherApi = {
  getByCoords: (lat: number, lon: number) =>
    axios.get<WeatherData>(`${BASE}/weather`, { params: { lat, lon } }),
  getByCity: (city: string) =>
    axios.get<WeatherData>(`${BASE}/weather`, { params: { city } }),
}
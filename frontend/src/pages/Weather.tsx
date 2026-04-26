import { useEffect, useState } from "react"
import { weatherApi } from "../api/weather"
import type { WeatherData } from "../api/weather"
import { MapPin, Wind, Droplets, Sun, Search, Loader2, RefreshCw } from "lucide-react"

function StatCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-navy-800 border border-gray-200 dark:border-navy-600 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-gray-400 dark:text-gray-500">{icon}</span>
        <span className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-xl font-medium text-gray-900 dark:text-gray-100">{value}</p>
    </div>
  )
}

function getDayName(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00")
  return date.toLocaleDateString("en-US", { weekday: "short" })
}

export default function Weather() {
  const [data, setData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cityInput, setCityInput] = useState("")
  const [searching, setSearching] = useState(false)
  const [showAllForecast, setShowAllForecast] = useState(false)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => loadByCoords(pos.coords.latitude, pos.coords.longitude),
        () => loadByCity("Boston")   // fallback
      )
    } else {
      loadByCity("Boston")
    }
  }, [])

  async function loadByCoords(lat: number, lon: number) {
    setLoading(true)
    setError(null)
    try {
      const res = await weatherApi.getByCoords(lat, lon)
      setData(res.data)
    } catch {
      setError("Failed to load weather data.")
    } finally {
      setLoading(false)
    }
  }

  async function loadByCity(city: string) {
    setLoading(true)
    setError(null)
    try {
      const res = await weatherApi.getByCity(city)
      setData(res.data)
    } catch {
      setError(`City "${city}" not found.`)
    } finally {
      setLoading(false)
      setSearching(false)
    }
  }

  async function handleSearch() {
    if (!cityInput.trim()) return
    setSearching(true)
    await loadByCity(cityInput.trim())
    setCityInput("")
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 size={24} className="animate-spin text-teal-500" />
    </div>
  )

  if (error) return (
    <div className="max-w-lg mx-auto text-center py-20">
      <p className="text-gray-500 dark:text-gray-400 mb-4">{error}</p>
      <button onClick={() => loadByCity("Boston")} className="text-teal-500 text-sm underline">
        Try Boston instead
      </button>
    </div>
  )

  if (!data) return null

  return (
    <div className="max-w-2xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
            Weather
          </h1>
          <div className="flex items-center gap-1 text-sm text-gray-400 dark:text-gray-500">
            <MapPin size={13} />
            <span>{data.city}</span>
          </div>
        </div>
        <button
          onClick={() => loadByCity(data.city)}
          className="p-2 rounded-lg text-gray-400 hover:text-teal-500 hover:bg-gray-100 dark:hover:bg-navy-600 transition-colors"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Search */}
      <div className="flex gap-2 mb-8">
        <input
          value={cityInput}
          onChange={e => setCityInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSearch()}
          placeholder="Search city..."
          className="
            flex-1 px-3 py-2 text-sm rounded-lg
            bg-white dark:bg-navy-800
            border border-gray-200 dark:border-navy-600
            text-gray-900 dark:text-gray-100
            placeholder-gray-400 dark:placeholder-gray-600
            focus:outline-none focus:ring-2 focus:ring-teal-500/30
          "
        />
        <button
          onClick={handleSearch}
          disabled={searching || !cityInput.trim()}
          className="
            px-4 py-2 rounded-lg text-sm font-medium
            bg-teal-600 hover:bg-teal-700 text-white
            disabled:opacity-40 transition-colors flex items-center gap-2
          "
        >
          {searching ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
        </button>
      </div>

      {/* Hero — current weather */}
      <div className="bg-white dark:bg-navy-800 border border-gray-200 dark:border-navy-600 rounded-2xl p-8 mb-6 text-center">
        <div className="text-7xl mb-4">{data.current.emoji}</div>
        <div className="text-6xl font-light text-gray-900 dark:text-gray-100 mb-2">
          {Math.round(data.current.temp)}°C
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400 capitalize mb-6">
          {data.current.description} · feels like {Math.round(data.current.feels_like)}°C
        </div>
        {/* AI summary */}
        <p className="text-sm text-teal-600 dark:text-teal-400 italic max-w-md mx-auto">
          {data.summary}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatCard label="Humidity" value={`${data.current.humidity}%`} icon={<Droplets size={14} />} />
        <StatCard label="Wind" value={`${Math.round(data.current.wind_kmh)} km/h`} icon={<Wind size={14} />} />
        <StatCard label="UV Index" value={`${data.current.uv_index}`} icon={<Sun size={14} />} />
      </div>

      <div className="bg-white dark:bg-navy-800 border border-gray-200 dark:border-navy-600 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            {showAllForecast ? "16-day forecast" : "5-day forecast"}
          </h2>
          <button
            onClick={() => setShowAllForecast(p => !p)}
            className="text-xs text-teal-500 hover:text-teal-600 dark:hover:text-teal-300 transition-colors"
          >
            {showAllForecast ? "Show less" : "View more"}
          </button>
        </div>
        <div className="space-y-3">
          {(showAllForecast ? data.forecast : data.forecast.slice(0, 5)).map(day => (
            <div key={day.date} className="flex items-center gap-4">
              <span className="text-sm text-gray-500 dark:text-gray-400 w-10">
                {getDayName(day.date)}
              </span>
              <span className="text-lg w-8">{day.emoji}</span>
              <span className="text-xs text-gray-400 dark:text-gray-500 flex-1 capitalize">
                {day.description}
              </span>
              <span className="text-xs text-blue-400 dark:text-blue-500 w-10 text-right">
                {day.rain_pct}%
              </span>
              <span className="text-sm text-gray-900 dark:text-gray-100 w-24 text-right">
                {Math.round(day.max)}° / {Math.round(day.min)}°
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
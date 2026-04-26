import { useEffect, useState } from "react"
import { stocksApi } from "../api/stocks"
import type { ExchangeData, Stock, StocksResponse } from "../api/stocks"
import { TrendingUp, RefreshCw, Loader2, Clock } from "lucide-react"

function StockRow({ stock, exchange }: { stock: Stock; exchange: string }) {
  const positive = stock.change_pct >= 0
  const currency = exchange === "BSE" ? "₹" : "$"
  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-100 dark:border-navy-700 last:border-0">
      {/* Symbol */}
      <div className="w-28 flex-shrink-0">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {stock.symbol}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Vol {stock.volume}
        </p>
      </div>

      {/* High / Low */}
      <div className="flex-1 hidden sm:block">
        <p className="text-xs text-gray-400 dark:text-gray-500">
          H {stock.high} · L {stock.low}
        </p>
      </div>

      {/* Price */}
      <div className="text-right">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {currency}{stock.price.toLocaleString("en-US")}
        </p>
        <p className={`text-xs font-medium ${positive ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}>
          {positive ? "+" : ""}{stock.change} ({positive ? "+" : ""}{stock.change_pct}%)
        </p>
      </div>
    </div>
  )
}

function ExchangeCard({ data }: { data: ExchangeData }) {
  return (
    <div className="bg-white dark:bg-navy-800 border border-gray-200 dark:border-navy-600 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <TrendingUp size={16} className="text-teal-500" />
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            {data.exchange}
          </h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 font-medium">
            Top 5 gainers
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
          <Clock size={11} />
          <span>{data.as_of}</span>
        </div>
      </div>

      {/* AI summary */}
      <p className="text-xs text-teal-600 dark:text-teal-400 italic mb-4">
        {data.summary}
      </p>

      {/* Stock rows */}
      {data.stocks.length > 0
        ? data.stocks.map(s => (
            <StockRow key={s.symbol} stock={s} exchange={data.exchange} />
          ))
        : (
          <p className="text-sm text-gray-400 dark:text-gray-500 py-4 text-center">
            No data available — market may be closed.
          </p>
        )
      }
    </div>
  )
}

export default function Stocks() {
  const [data, setData]             = useState<StocksResponse | null>(null)
  const [loading, setLoading]       = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError]           = useState<string | null>(null)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const res = await stocksApi.get()
      setData(res.data)
    } catch {
      setError("Failed to load stock data.")
    } finally {
      setLoading(false)
    }
  }

  async function handleRefresh() {
    setRefreshing(true)
    setError(null)
    try {
      const res = await stocksApi.refresh()
      setData(res.data)
    } catch {
      setError("Failed to refresh.")
    } finally {
      setRefreshing(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
            Stocks
          </h1>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            NYSE &amp; BSE · top gainers today · 15 min cache
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing || loading}
          className="p-2 rounded-lg text-gray-400 hover:text-teal-500 hover:bg-gray-100 dark:hover:bg-navy-600 transition-colors disabled:opacity-40"
        >
          <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
        </button>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 size={24} className="animate-spin text-teal-500" />
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Fetching market data — this takes ~15 seconds on first load...
          </p>
        </div>
      )}

      {error && !loading && (
        <div className="text-center py-20">
          <p className="text-gray-500 dark:text-gray-400 mb-4">{error}</p>
          <button onClick={load} className="text-teal-500 text-sm underline">Try again</button>
        </div>
      )}

      {!loading && !error && data && (
        <div className="space-y-6">
          <ExchangeCard data={data.nyse} />
          <ExchangeCard data={data.bse} />
        </div>
      )}
    </div>
  )
}
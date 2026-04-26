import { useEffect, useState } from "react"
import { newsApi } from "../api/news"
import type { Article } from "../api/news"
import { ExternalLink, RefreshCw, Loader2, Newspaper } from "lucide-react"

export default function News() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const res = await newsApi.getTop()
      setArticles(res.data)
    } catch {
      setError("Failed to load news.")
    } finally {
      setLoading(false)
    }
  }

  async function handleRefresh() {
    setRefreshing(true)
    setError(null)
    try {
      const res = await newsApi.refresh()
      setArticles(res.data)
    } catch {
      setError("Failed to refresh news.")
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
            News
          </h1>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Top world stories · AI summarized
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

      {/* States */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 size={24} className="animate-spin text-teal-500" />
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Fetching and summarizing articles...
          </p>
        </div>
      )}

      {error && !loading && (
        <div className="text-center py-20">
          <p className="text-gray-500 dark:text-gray-400 mb-4">{error}</p>
          <button onClick={load} className="text-teal-500 text-sm underline">Try again</button>
        </div>
      )}

      {/* Articles */}
      {!loading && !error && (
        <div className="space-y-4">
          {articles.map((article, i) => (
            <ArticleCard key={i} article={article} index={i} />
          ))}

          {articles.length === 0 && (
            <div className="text-center py-20">
              <Newspaper size={32} className="mx-auto mb-3 text-gray-300 dark:text-gray-600" />
              <p className="text-sm text-gray-400 dark:text-gray-500">No articles found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function ArticleCard({ article, index }: { article: Article; index: number }) {
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-5 rounded-2xl border bg-white dark:bg-navy-800 border-gray-200 dark:border-navy-600 hover:border-teal-300 dark:hover:border-teal-700 hover:shadow-sm transition-all duration-150 group"
    >
      <div className="flex gap-4">
        <span className="text-2xl font-light text-gray-200 dark:text-navy-600 select-none flex-shrink-0 w-6 pt-0.5">
          {index + 1}
        </span>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-teal-600 dark:text-teal-400">
              {article.source}
            </span>
            <span className="text-gray-300 dark:text-gray-600 text-xs">·</span>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {article.published}
            </span>
          </div>

          <h2 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2 leading-snug group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors">
            {article.title}
          </h2>

          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            {article.summary}
          </p>
        </div>

        {article.image && (
          <img
            src={article.image}
            alt=""
            className="w-20 h-16 object-cover rounded-lg flex-shrink-0"
            onError={e => (e.currentTarget.style.display = "none")}
          />
        )}

        <ExternalLink
          size={14}
          className="flex-shrink-0 text-gray-300 dark:text-gray-600 group-hover:text-teal-500 transition-colors mt-0.5"
        />
      </div>
    </a>
  )
}
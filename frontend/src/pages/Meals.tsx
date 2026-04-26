import { useState } from "react"
import { mealsApi } from "../api/meals"
import type { Meal } from "../api/meals"
import {
  Sparkles, Loader2, Clock, IndianRupee,
  ChevronDown, ChevronUp, UtensilsCrossed
} from "lucide-react"

const TAG_STYLES: Record<string, string> = {
  quick:        "bg-green-50  dark:bg-green-900/20  text-green-600  dark:text-green-400",
  "high-protein":"bg-blue-50  dark:bg-blue-900/20   text-blue-600   dark:text-blue-400",
  light:        "bg-sky-50    dark:bg-sky-900/20    text-sky-600    dark:text-sky-400",
  filling:      "bg-amber-50  dark:bg-amber-900/20  text-amber-600  dark:text-amber-400",
  spicy:        "bg-red-50    dark:bg-red-900/20    text-red-600    dark:text-red-400",
  mild:         "bg-gray-100  dark:bg-navy-600      text-gray-600   dark:text-gray-400",
  budget:       "bg-teal-50   dark:bg-teal-900/20   text-teal-600   dark:text-teal-400",
  "one-pot":    "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
}

function MealCard({ meal }: { meal: Meal }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-white dark:bg-navy-800 border border-gray-200 dark:border-navy-600 rounded-2xl overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(p => !p)}
        className="w-full text-left p-5"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">
              {meal.name}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              {meal.description}
            </p>
            {/* Meta row */}
            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                <Clock size={12} />
                <span>{meal.time_minutes} min</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                <IndianRupee size={12} />
                <span>~₹{meal.estimated_cost_inr}</span>
              </div>
            </div>
            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {meal.tags.map(tag => (
                <span
                  key={tag}
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${TAG_STYLES[tag] ?? TAG_STYLES.mild}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <span className="text-gray-400 dark:text-gray-500 flex-shrink-0 mt-1">
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </span>
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-5 pb-5 border-t border-gray-100 dark:border-navy-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
            {/* Ingredients */}
            <div>
              <h3 className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
                Ingredients
              </h3>
              <ul className="space-y-1.5">
                {meal.ingredients.map((ing, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <span className="text-teal-400 mt-0.5 flex-shrink-0">·</span>
                    {ing}
                  </li>
                ))}
              </ul>
            </div>

            {/* Steps */}
            <div>
              <h3 className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
                Steps
              </h3>
              <ol className="space-y-2">
                {meal.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700 dark:text-gray-300">
                    <span className="text-xs font-medium text-teal-500 dark:text-teal-400 flex-shrink-0 mt-0.5 w-4">
                      {i + 1}.
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Meals() {
  const [meals, setMeals]       = useState<Meal[]>([])
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)
  const [prompt, setPrompt]     = useState("")
  const [maxTime, setMaxTime]   = useState(30)
  const [maxBudget, setMaxBudget] = useState(150)

  async function handleGenerate(surprise = false) {
    setLoading(true)
    setError(null)
    try {
      const res = await mealsApi.generate({
        prompt:     surprise ? undefined : prompt || undefined,
        max_time:   maxTime,
        max_budget: maxBudget,
        num_meals:  3,
      })
      setMeals(res.data.meals)
    } catch {
      setError("Failed to generate meals. Try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
          Meal Ideas
        </h1>
        <p className="text-sm text-gray-400 dark:text-gray-500">
          Vegetarian · eggless · AI-generated
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-navy-800 border border-gray-200 dark:border-navy-600 rounded-2xl p-5 mb-6 space-y-4">
        {/* Prompt */}
        <input
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleGenerate()}
          placeholder='e.g. "something with dal and rice, under 20 mins"'
          className="
            w-full px-3 py-2 text-sm rounded-lg
            bg-gray-50 dark:bg-navy-700
            border border-gray-200 dark:border-navy-600
            text-gray-900 dark:text-gray-100
            placeholder-gray-400 dark:placeholder-gray-600
            focus:outline-none focus:ring-2 focus:ring-teal-500/30
          "
        />

        {/* Sliders */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-xs text-gray-400 dark:text-gray-500">Max time</label>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{maxTime} min</span>
            </div>
            <input
              type="range" min={10} max={60} step={5}
              value={maxTime}
              onChange={e => setMaxTime(Number(e.target.value))}
              className="w-full accent-teal-500"
            />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-xs text-gray-400 dark:text-gray-500">Max budget</label>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">₹{maxBudget}</span>
            </div>
            <input
              type="range" min={50} max={500} step={25}
              value={maxBudget}
              onChange={e => setMaxBudget(Number(e.target.value))}
              className="w-full accent-teal-500"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => handleGenerate(false)}
            disabled={loading}
            className="
              flex-1 py-2 rounded-lg text-sm font-medium
              bg-teal-600 hover:bg-teal-700 text-white
              disabled:opacity-40 transition-colors flex items-center justify-center gap-2
            "
          >
            {loading
              ? <><Loader2 size={14} className="animate-spin" /> Generating...</>
              : <><Sparkles size={14} /> Generate</>
            }
          </button>
          <button
            onClick={() => handleGenerate(true)}
            disabled={loading}
            className="
              px-4 py-2 rounded-lg text-sm font-medium
              border border-gray-200 dark:border-navy-600
              text-gray-600 dark:text-gray-400
              hover:bg-gray-50 dark:hover:bg-navy-700
              disabled:opacity-40 transition-colors
            "
          >
            Surprise me
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-500 dark:text-red-400 text-center mb-4">{error}</p>
      )}

      {/* Empty state */}
      {!loading && meals.length === 0 && !error && (
        <div className="text-center py-16 text-gray-400 dark:text-gray-600">
          <UtensilsCrossed size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">Describe what you're craving or hit "Surprise me".</p>
        </div>
      )}

      {/* Meal cards */}
      {!loading && meals.length > 0 && (
        <div className="space-y-4">
          {meals.map((meal, i) => (
            <MealCard key={i} meal={meal} />
          ))}
        </div>
      )}
    </div>
  )
}
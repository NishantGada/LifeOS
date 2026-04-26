import { useEffect, useState } from "react"
import { goalsApi } from "../api/goals"
import type { Goal, Milestone } from "../api/goals"
import {
  Plus, Trash2, ChevronDown, ChevronUp,
  Sparkles, Loader2, CheckCircle2, Circle,
  Target, Calendar
} from "lucide-react"

const CATEGORIES = ["Personal", "Work", "Learning", "Health", "Finance"]

const CATEGORY_STYLE: Record<string, string> = {
  Personal: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
  Work: "bg-blue-50   dark:bg-blue-900/20   text-blue-600   dark:text-blue-400",
  Learning: "bg-amber-50  dark:bg-amber-900/20  text-amber-600  dark:text-amber-400",
  Health: "bg-green-50  dark:bg-green-900/20  text-green-600  dark:text-green-400",
  Finance: "bg-teal-50   dark:bg-teal-900/20   text-teal-600   dark:text-teal-400",
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full h-1.5 bg-gray-100 dark:bg-navy-700 rounded-full overflow-hidden">
      <div
        className="h-full bg-teal-500 rounded-full transition-all duration-300"
        style={{ width: `${value}%` }}
      />
    </div>
  )
}

function GoalCard({
  goal,
  onUpdate,
  onDelete,
}: {
  goal: Goal
  onUpdate: (g: Goal) => void
  onDelete: (id: number) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [editing, setEditing] = useState(false)
  const [msInput, setMsInput] = useState("")
  const [plan, setPlan] = useState<string | null>(null)
  const [planLoading, setPlanLoading] = useState(false)
  const [progress, setProgress] = useState(goal.progress)
  const [editForm, setEditForm] = useState({
    title: goal.title,
    description: goal.description,
    category: goal.category,
    target_date: goal.target_date ?? "",
  })

  async function handleProgressChange(val: number) {
    setProgress(val)
    const res = await goalsApi.update(goal.id, { progress: val })
    onUpdate(res.data)
  }

  async function handleSaveEdit() {
    const res = await goalsApi.update(goal.id, {
      title: editForm.title,
      description: editForm.description,
      category: editForm.category,
      target_date: editForm.target_date || null,
    })
    onUpdate(res.data)
    setEditing(false)
  }

  async function handleAddMilestone() {
    if (!msInput.trim()) return
    const res = await goalsApi.addMilestone(goal.id, msInput.trim())
    setMsInput("")
    onUpdate({ ...goal, milestones: [...goal.milestones, res.data] })
  }

  async function handleToggleMilestone(ms: Milestone) {
    const res = await goalsApi.toggleMilestone(goal.id, ms.id)
    onUpdate({
      ...goal,
      milestones: goal.milestones.map(m => m.id === ms.id ? res.data : m),
    })
  }

  async function handleDeleteMilestone(msId: number) {
    await goalsApi.deleteMilestone(goal.id, msId)
    onUpdate({ ...goal, milestones: goal.milestones.filter(m => m.id !== msId) })
  }

  async function handleActionPlan() {
    setPlanLoading(true)
    try {
      const res = await goalsApi.actionPlan(goal.id)
      setPlan(res.data.plan)
    } finally {
      setPlanLoading(false)
    }
  }

  const completedMs = goal.milestones.filter(m => m.completed).length

  const inputClass = `
    w-full px-3 py-2 text-sm rounded-lg
    bg-gray-50 dark:bg-navy-700
    border border-gray-200 dark:border-navy-600
    text-gray-900 dark:text-gray-100
    placeholder-gray-400 dark:placeholder-gray-600
    focus:outline-none focus:ring-2 focus:ring-teal-500/30
  `

  return (
    <div className="bg-white dark:bg-navy-800 border border-gray-200 dark:border-navy-600 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-5">
        {editing ? (
          /* ── Edit mode ── */
          <div className="space-y-3">
            <input
              value={editForm.title}
              onChange={e => setEditForm(p => ({ ...p, title: e.target.value }))}
              placeholder="Goal title"
              className={inputClass}
            />
            <input
              value={editForm.description}
              onChange={e => setEditForm(p => ({ ...p, description: e.target.value }))}
              placeholder="Description (optional)"
              className={inputClass}
            />
            <div className="flex gap-3">
              <select
                value={editForm.category}
                onChange={e => setEditForm(p => ({ ...p, category: e.target.value }))}
                className={`flex-1 ${inputClass}`}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input
                type="date"
                value={editForm.target_date}
                onChange={e => setEditForm(p => ({ ...p, target_date: e.target.value }))}
                className={`flex-1 ${inputClass}`}
              />
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={handleSaveEdit}
                disabled={!editForm.title.trim()}
                className="flex-1 py-2 rounded-lg text-sm font-medium bg-teal-600 hover:bg-teal-700 text-white disabled:opacity-40 transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setEditing(false)
                  setEditForm({
                    title: goal.title,
                    description: goal.description,
                    category: goal.category,
                    target_date: goal.target_date ?? "",
                  })
                }}
                className="flex-1 py-2 rounded-lg text-sm font-medium border border-gray-200 dark:border-navy-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-navy-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          /* ── View mode ── */
          <button
            onClick={() => setExpanded(p => !p)}
            className="w-full text-left"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_STYLE[goal.category] ?? CATEGORY_STYLE.Personal}`}>
                    {goal.category}
                  </span>
                  {goal.target_date && (
                    <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                      <Calendar size={11} />
                      {goal.target_date}
                    </span>
                  )}
                </div>

                <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  {goal.title}
                </h2>

                {goal.description && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    {goal.description}
                  </p>
                )}

                <div className="flex items-center gap-3">
                  <ProgressBar value={progress} />
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 w-10 text-right flex-shrink-0">
                    {progress}%
                  </span>
                </div>

                {goal.milestones.length > 0 && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                    {completedMs}/{goal.milestones.length} milestones done
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={e => { e.stopPropagation(); setEditing(true); setExpanded(true) }}
                  className="text-gray-300 dark:text-gray-600 hover:text-teal-500 transition-colors"
                  title="Edit goal"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
                <button
                  onClick={e => { e.stopPropagation(); onDelete(goal.id) }}
                  className="text-gray-300 dark:text-gray-600 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={15} />
                </button>
                {expanded
                  ? <ChevronUp size={16} className="text-gray-400" />
                  : <ChevronDown size={16} className="text-gray-400" />
                }
              </div>
            </div>
          </button>
        )}
      </div>

      {/* Expanded content — unchanged from before */}
      {expanded && !editing && (
        <div className="px-5 pb-5 border-t border-gray-100 dark:border-navy-700 space-y-5 pt-4">

          {/* Progress slider */}
          <div>
            <label className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              Progress
            </label>
            <div className="flex items-center gap-3 mt-2">
              <input
                type="range" min={0} max={100} step={5}
                value={progress}
                onChange={e => setProgress(Number(e.target.value))}
                onMouseUp={e => handleProgressChange(Number((e.target as HTMLInputElement).value))}
                onTouchEnd={e => handleProgressChange(Number((e.target as HTMLInputElement).value))}
                className="flex-1 accent-teal-500"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-10 text-right">
                {progress}%
              </span>
            </div>
          </div>

          {/* Milestones */}
          <div>
            <label className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              Milestones
            </label>
            <div className="mt-2 space-y-2">
              {goal.milestones.map(ms => (
                <div key={ms.id} className="flex items-center gap-2 group">
                  <button
                    onClick={() => handleToggleMilestone(ms)}
                    className="text-gray-300 dark:text-gray-600 hover:text-teal-500 transition-colors flex-shrink-0"
                  >
                    {ms.completed
                      ? <CheckCircle2 size={16} className="text-teal-500" />
                      : <Circle size={16} />
                    }
                  </button>
                  <span className={`text-sm flex-1 ${ms.completed ? "line-through text-gray-400 dark:text-gray-600" : "text-gray-700 dark:text-gray-300"}`}>
                    {ms.title}
                  </span>
                  <button
                    onClick={() => handleDeleteMilestone(ms.id)}
                    className="opacity-0 group-hover:opacity-100 text-gray-300 dark:text-gray-600 hover:text-red-400 transition-all"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-3">
              <input
                value={msInput}
                onChange={e => setMsInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleAddMilestone()}
                placeholder="Add a milestone..."
                className="
                  flex-1 px-3 py-1.5 text-sm rounded-lg
                  bg-gray-50 dark:bg-navy-700
                  border border-gray-200 dark:border-navy-600
                  text-gray-900 dark:text-gray-100
                  placeholder-gray-400 dark:placeholder-gray-600
                  focus:outline-none focus:ring-2 focus:ring-teal-500/30
                "
              />
              <button
                onClick={handleAddMilestone}
                disabled={!msInput.trim()}
                className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-sm disabled:opacity-40 transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* AI Action Plan */}
          <div>
            <button
              onClick={handleActionPlan}
              disabled={planLoading}
              className="flex items-center gap-2 text-sm font-medium text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 disabled:opacity-40 transition-colors"
            >
              {planLoading
                ? <><Loader2 size={14} className="animate-spin" /> Generating plan...</>
                : <><Sparkles size={14} /> Generate weekly action plan</>
              }
            </button>
            {plan && (
              <div className="mt-3 p-4 rounded-xl bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-800">
                <p className="text-xs font-medium text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-2">
                  This week's plan
                </p>
                <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans leading-relaxed">
                  {plan}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

const emptyForm = () => ({ title: "", description: "", category: "Personal", target_date: "" })

export default function Goals() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm())

  useEffect(() => { fetchGoals() }, [])

  async function fetchGoals() {
    try {
      const res = await goalsApi.getAll()
      setGoals(res.data)
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate() {
    if (!form.title.trim()) return
    const res = await goalsApi.create({
      title: form.title,
      description: form.description || undefined,
      category: form.category,
      target_date: form.target_date || null,
    })
    setGoals(prev => [res.data, ...prev])
    setForm(emptyForm())
    setShowForm(false)
  }

  function handleUpdate(updated: Goal) {
    setGoals(prev => prev.map(g => g.id === updated.id ? updated : g))
  }

  async function handleDelete(id: number) {
    await goalsApi.delete(id)
    setGoals(prev => prev.filter(g => g.id !== id))
  }

  return (
    <div className="max-w-2xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
          Goals
        </h1>
        <p className="text-sm text-gray-400 dark:text-gray-500">
          {goals.length} goal{goals.length !== 1 ? "s" : ""} · track progress · AI action plans
        </p>
      </div>

      {/* Add goal button */}
      <button
        onClick={() => setShowForm(p => !p)}
        className="
          w-full mb-4 px-4 py-2.5 rounded-xl text-sm font-medium
          border border-dashed border-gray-300 dark:border-navy-500
          text-gray-500 dark:text-gray-400
          hover:border-teal-400 hover:text-teal-600 dark:hover:text-teal-400
          transition-colors flex items-center justify-center gap-2
        "
      >
        {showForm
          ? <><ChevronUp size={15} /> Hide form</>
          : <><Plus size={15} /> Add goal</>
        }
      </button>

      {/* Form */}
      {showForm && (
        <div className="mb-6 p-4 rounded-xl border border-gray-200 dark:border-navy-600 bg-white dark:bg-navy-800 space-y-3">
          <input
            value={form.title}
            onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
            placeholder="Goal title"
            className="
              w-full px-3 py-2 text-sm rounded-lg
              bg-gray-50 dark:bg-navy-700
              border border-gray-200 dark:border-navy-600
              text-gray-900 dark:text-gray-100
              placeholder-gray-400 dark:placeholder-gray-600
              focus:outline-none focus:ring-2 focus:ring-teal-500/30
            "
          />
          <input
            value={form.description}
            onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
            placeholder="Description (optional)"
            className="
              w-full px-3 py-2 text-sm rounded-lg
              bg-gray-50 dark:bg-navy-700
              border border-gray-200 dark:border-navy-600
              text-gray-900 dark:text-gray-100
              placeholder-gray-400 dark:placeholder-gray-600
              focus:outline-none focus:ring-2 focus:ring-teal-500/30
            "
          />
          <div className="flex gap-3">
            <select
              value={form.category}
              onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
              className="
                flex-1 px-3 py-2 text-sm rounded-lg
                bg-gray-50 dark:bg-navy-700
                border border-gray-200 dark:border-navy-600
                text-gray-900 dark:text-gray-100
                focus:outline-none focus:ring-2 focus:ring-teal-500/30
              "
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input
              type="date"
              value={form.target_date}
              onChange={e => setForm(p => ({ ...p, target_date: e.target.value }))}
              className="
                flex-1 px-3 py-2 text-sm rounded-lg
                bg-gray-50 dark:bg-navy-700
                border border-gray-200 dark:border-navy-600
                text-gray-900 dark:text-gray-100
                focus:outline-none focus:ring-2 focus:ring-teal-500/30
              "
            />
          </div>
          <button
            onClick={handleCreate}
            disabled={!form.title.trim()}
            className="
              w-full py-2 rounded-lg text-sm font-medium
              bg-teal-600 hover:bg-teal-700 text-white
              disabled:opacity-40 transition-colors
            "
          >
            Create Goal
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-12">
          <Loader2 size={20} className="animate-spin text-teal-500" />
        </div>
      )}

      {/* Goals list */}
      {!loading && (
        <div className="space-y-4">
          {goals.map(goal => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))}

          {goals.length === 0 && (
            <div className="text-center py-16 text-gray-400 dark:text-gray-600">
              <Target size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No goals yet. Add one above.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
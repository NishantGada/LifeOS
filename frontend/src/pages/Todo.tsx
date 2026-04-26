import { useEffect, useState } from "react"
import { todosApi } from "../api/todos"
import type { Todo, TodoCreate } from "../api/todos"
import {
  Plus, Trash2, CheckCircle2, Circle,
  Sparkles, Loader2, ChevronDown, ChevronUp
} from "lucide-react"

const PRIORITIES = ["low", "medium", "high"] as const
const CATEGORIES = ["Work", "Personal", "Learning", "Health"] as const

const priorityStyle: Record<string, string> = {
  low: "bg-gray-100 text-gray-500 dark:bg-navy-600 dark:text-gray-400",
  medium: "bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
  high: "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400",
}

const categoryStyle: Record<string, string> = {
  Work: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
  Personal: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
  Learning: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
  Health: "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400",
}

const emptyForm = (): TodoCreate => ({
  title: "", notes: "", priority: "medium", category: "Personal", due_date: null
})

export default function Todo() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [form, setForm] = useState<TodoCreate>(emptyForm())
  const [aiText, setAiText] = useState("")
  const [aiLoading, setAiLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchTodos() }, [])

  async function fetchTodos() {
    try {
      const res = await todosApi.getAll()
      setTodos(res.data)
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate() {
    if (!form.title.trim()) return
    const res = await todosApi.create(form)
    setTodos(prev => [res.data, ...prev])
    setForm(emptyForm())
    setShowForm(false)
  }

  async function handleToggle(todo: Todo) {
    const res = await todosApi.update(todo.id, { completed: !todo.completed })
    setTodos(prev => prev.map(t => t.id === todo.id ? res.data : t))
  }

  async function handleDelete(id: number) {
    await todosApi.delete(id)
    setTodos(prev => prev.filter(t => t.id !== id))
  }

  async function handleAIParse() {
    if (!aiText.trim()) return
    setAiLoading(true)
    try {
      const res = await todosApi.aiParse(aiText)
      setForm(res.data)
      setShowForm(true)
      setAiText("")
    } finally {
      setAiLoading(false)
    }
  }

  const active = todos.filter(t => !t.completed)
  const completed = todos.filter(t => t.completed)

  return (
    <div className="max-w-2xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
          Tasks
        </h1>
        <p className="text-sm text-gray-400 dark:text-gray-500">
          {active.length} remaining · {completed.length} done
        </p>
      </div>

      {/* AI input */}
      <div className="mb-6 p-4 rounded-xl border border-gray-200 dark:border-navy-600 bg-white dark:bg-navy-800">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={14} className="text-teal-500" />
          <span className="text-xs font-medium text-teal-600 dark:text-teal-400 uppercase tracking-wide">
            AI Parse
          </span>
        </div>
        <div className="flex gap-2">
          <input
            value={aiText}
            onChange={e => setAiText(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleAIParse()}
            placeholder='e.g. "prep for Goodbill interview this Friday, urgent"'
            className="
              flex-1 px-3 py-2 text-sm rounded-lg
              bg-gray-50 dark:bg-navy-700
              border border-gray-200 dark:border-navy-600
              text-gray-900 dark:text-gray-100
              placeholder-gray-400 dark:placeholder-gray-600
              focus:outline-none focus:ring-2 focus:ring-teal-500/30
            "
          />
          <button
            onClick={handleAIParse}
            disabled={aiLoading || !aiText.trim()}
            className="
              px-4 py-2 rounded-lg text-sm font-medium
              bg-teal-600 hover:bg-teal-700 text-white
              disabled:opacity-40 disabled:cursor-not-allowed
              transition-colors flex items-center gap-2
            "
          >
            {aiLoading ? <Loader2 size={14} className="animate-spin" /> : "Parse"}
          </button>
        </div>
      </div>

      {/* Manual add form toggle */}
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
          : <><Plus size={15} /> Add task manually</>
        }
      </button>

      {/* Manual form */}
      {showForm && (
        <div className="mb-6 p-4 rounded-xl border border-gray-200 dark:border-navy-600 bg-white dark:bg-navy-800 space-y-3">
          <input
            value={form.title}
            onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
            onKeyDown={e => e.key === "Enter" && handleCreate()}
            placeholder="Task title"
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
            value={form.notes}
            onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
            placeholder="Notes (optional)"
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
            {/* Priority */}
            <select
              value={form.priority}
              onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}
              className="
                flex-1 px-3 py-2 text-sm rounded-lg
                bg-gray-50 dark:bg-navy-700
                border border-gray-200 dark:border-navy-600
                text-gray-900 dark:text-gray-100
                focus:outline-none focus:ring-2 focus:ring-teal-500/30
              "
            >
              {PRIORITIES.map(p => (
                <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
              ))}
            </select>
            {/* Category */}
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
            {/* Due date */}
            <input
              type="date"
              value={form.due_date ?? ""}
              onChange={e => setForm(p => ({ ...p, due_date: e.target.value || null }))}
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
            Add Task
          </button>
        </div>
      )}

      {/* Task list */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 size={20} className="animate-spin text-teal-500" />
        </div>
      ) : (
        <div className="space-y-2">
          {active.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          ))}

          {completed.length > 0 && (
            <>
              <div className="pt-4 pb-2">
                <span className="text-xs font-medium text-gray-400 dark:text-gray-600 uppercase tracking-wider">
                  Completed
                </span>
              </div>
              {completed.map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                />
              ))}
            </>
          )}

          {todos.length === 0 && (
            <div className="text-center py-16 text-gray-400 dark:text-gray-600">
              <CheckCircle2 size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No tasks yet. Add one above.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function TodoItem({
  todo, onToggle, onDelete
}: {
  todo: Todo
  onToggle: (t: Todo) => void
  onDelete: (id: number) => void
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className={`
      group px-4 py-3 rounded-xl border transition-all duration-150
      bg-white dark:bg-navy-800
      ${todo.completed
        ? "border-gray-100 dark:border-navy-700 opacity-50"
        : "border-gray-200 dark:border-navy-600"
      }
    `}>
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(todo)}
          className="mt-0.5 text-gray-300 dark:text-gray-600 hover:text-teal-500 transition-colors flex-shrink-0"
        >
          {todo.completed
            ? <CheckCircle2 size={18} className="text-teal-500" />
            : <Circle size={18} />
          }
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`
              text-sm font-medium text-gray-900 dark:text-gray-100
              ${todo.completed ? "line-through" : ""}
            `}>
              {todo.title}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityStyle[todo.priority]}`}>
              {todo.priority}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryStyle[todo.category] ?? categoryStyle.Personal}`}>
              {todo.category}
            </span>
            {todo.due_date && (
              <span className="text-xs text-gray-400 dark:text-gray-500">
                due {todo.due_date}
              </span>
            )}
          </div>
          {todo.notes && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate">
              {todo.notes}
            </p>
          )}
        </div>

        {/* Delete */}
        <button
          onClick={() => onDelete(todo.id)}
          className="
            opacity-0 group-hover:opacity-100
            text-gray-300 dark:text-gray-600
            hover:text-red-400 transition-all flex-shrink-0
          "
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  )
}
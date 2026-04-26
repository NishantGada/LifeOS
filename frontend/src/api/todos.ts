import axios from "axios"
import { config } from "../config"

const BASE = config.apiBase

export interface Todo {
  id:         number
  title:      string
  notes:      string
  priority:   "low" | "medium" | "high"
  category:   string
  due_date:   string | null
  completed:  boolean
  created_at: string
}

export interface TodoCreate {
  title:    string
  notes?:   string
  priority?: string
  category?: string
  due_date?: string | null
}

export const todosApi = {
  getAll:   ()                          => axios.get<Todo[]>(`${BASE}/todos`),
  create:   (data: TodoCreate)          => axios.post<Todo>(`${BASE}/todos`, data),
  update:   (id: number, data: object)  => axios.patch<Todo>(`${BASE}/todos/${id}`, data),
  delete:   (id: number)                => axios.delete(`${BASE}/todos/${id}`),
  aiParse:  (text: string)              => axios.post(`${BASE}/todos/ai-parse`, { text }),
}
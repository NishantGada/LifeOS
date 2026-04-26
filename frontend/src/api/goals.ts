import axios from "axios"
import { config } from "../config"

const BASE = config.apiBase

export interface Milestone {
  id:        number
  goal_id:   number
  title:     string
  completed: boolean
}

export interface Goal {
  id:          number
  title:       string
  description: string
  category:    string
  target_date: string | null
  progress:    number
  created_at:  string
  milestones:  Milestone[]
}

export interface GoalCreate {
  title:       string
  description?: string
  category?:   string
  target_date?: string | null
}

export const goalsApi = {
  getAll:          ()                              => axios.get<Goal[]>(`${BASE}/goals`),
  create:          (data: GoalCreate)              => axios.post<Goal>(`${BASE}/goals`, data),
  update:          (id: number, data: object)      => axios.patch<Goal>(`${BASE}/goals/${id}`, data),
  delete:          (id: number)                    => axios.delete(`${BASE}/goals/${id}`),
  addMilestone:    (goalId: number, title: string) => axios.post<Milestone>(`${BASE}/goals/${goalId}/milestones`, { title }),
  toggleMilestone: (goalId: number, msId: number)  => axios.patch<Milestone>(`${BASE}/goals/${goalId}/milestones/${msId}`),
  deleteMilestone: (goalId: number, msId: number)  => axios.delete(`${BASE}/goals/${goalId}/milestones/${msId}`),
  actionPlan:      (goalId: number)                => axios.post<{ plan: string }>(`${BASE}/goals/action-plan`, { goal_id: goalId }),
}
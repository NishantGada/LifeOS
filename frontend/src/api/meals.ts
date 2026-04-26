import axios from "axios"
import { config } from "../config"

const BASE = config.apiBase

export interface Meal {
  name:                 string
  description:          string
  time_minutes:         number
  estimated_cost_inr:   number
  ingredients:          string[]
  steps:                string[]
  tags:                 string[]
}

export interface MealRequest {
  prompt?:     string
  max_time?:   number
  max_budget?: number
  num_meals?:  number
}

export const mealsApi = {
  generate: (req: MealRequest) => axios.post<{ meals: Meal[] }>(`${BASE}/meals`, req),
}
import axios from "axios"
import { config } from "../config"

const BASE = config.apiBase

export interface Article {
  title:     string
  summary:   string
  source:    string
  url:       string
  published: string
  image:     string | null
}

export const newsApi = {
  getTop:  ()              => axios.get<Article[]>(`${BASE}/news`),
  refresh: ()              => axios.get<Article[]>(`${BASE}/news?force=true`),
}
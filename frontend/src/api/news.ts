import axios from "axios"

const BASE = "http://localhost:8000"

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
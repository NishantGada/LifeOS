import axios from "axios"
import { config } from "../config"

const BASE = config.apiBase

export interface Stock {
  symbol:     string
  name:       string
  price:      number
  change:     number
  change_pct: number
  volume:     string
  high:       number
  low:        number
}

export interface ExchangeData {
  exchange: string
  stocks:   Stock[]
  summary:  string
  as_of:    string
}

export interface StocksResponse {
  nyse: ExchangeData
  bse:  ExchangeData
}

export const stocksApi = {
  get:     () => axios.get<StocksResponse>(`${BASE}/stocks`),
  refresh: () => axios.get<StocksResponse>(`${BASE}/stocks?force=true`),
}
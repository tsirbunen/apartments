export interface Filters {
  price: { min: number | null; max: number | null }
  size: { min: number | null; max: number | null }
  rooms: number[]
  omaTontti: boolean
  uudiskohde: boolean
}

export interface SavedQuery {
  id: string
  name: string
  filters: Filters
  savedAt: number
}

export const DEFAULT_FILTERS: Filters = {
  price: { min: null, max: null },
  size: { min: null, max: null },
  rooms: [],
  omaTontti: false,
  uudiskohde: false,
}

const STORAGE_KEY = 'apartments-saved-queries'

export function loadSavedQueries(): SavedQuery[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as SavedQuery[]) : []
  } catch {
    return []
  }
}

export function persistSavedQueries(queries: SavedQuery[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(queries))
}

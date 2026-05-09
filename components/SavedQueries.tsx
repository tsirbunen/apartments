'use client'

import { useEffect, useRef, useState } from 'react'
import {
  loadSavedQueries,
  persistSavedQueries,
  type Filters,
  type SavedQuery,
} from '@/lib/filters'

interface Props {
  filters: Filters
  onLoad: (filters: Filters) => void
}

function filtersEqual(a: Filters, b: Filters) {
  return JSON.stringify(a) === JSON.stringify(b)
}

export default function SavedQueries({ filters, onLoad }: Props) {
  const [queries, setQueries] = useState<SavedQuery[]>([])
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setQueries(loadSavedQueries())
  }, [])

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setSaving(false)
    }
    if (saving) document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [saving])

  function handleSave() {
    const trimmed = name.trim()
    if (!trimmed) return
    const query: SavedQuery = {
      id: crypto.randomUUID(),
      name: trimmed,
      filters,
      savedAt: Date.now(),
    }
    const updated = [query, ...queries]
    setQueries(updated)
    persistSavedQueries(updated)
    setName('')
    setSaving(false)
  }

  function handleDelete(id: string) {
    const updated = queries.filter((q) => q.id !== id)
    setQueries(updated)
    persistSavedQueries(updated)
  }

  const isAlreadySaved = queries.some((q) => filtersEqual(q.filters, filters))

  return (
    <div ref={ref} className="flex flex-wrap items-center gap-2">
      {queries.map((q) => (
        <span
          key={q.id}
          className="flex items-center gap-1 rounded-full bg-gray-200 px-3 py-1 text-sm text-gray-700 cursor-pointer hover:bg-gray-300"
          onClick={() => onLoad(q.filters)}
        >
          {q.name}
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleDelete(q.id)
            }}
            aria-label={`Poista ${q.name}`}
            className="ml-0.5 text-red-400 hover:text-red-600 leading-none"
          >
            ×
          </button>
        </span>
      ))}

      {!isAlreadySaved && (
        <div className="relative">
          <button
            onClick={() => setSaving((s) => !s)}
            className={`flex items-center px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              saving ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
            }`}
          >
            + Tallenna haku
          </button>

          {saving && (
            <div className="absolute top-full mt-2 left-0 z-20 w-72 rounded-2xl bg-white p-4 shadow-xl">
              <p className="mb-3 text-sm font-medium text-gray-900">Tallenna haku</p>
              <input
                type="text"
                autoFocus
                placeholder="Nimi haulle…"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave()
                  if (e.key === 'Escape') setSaving(false)
                }}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-gray-900 focus:outline-none"
              />
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => { setSaving(false); setName('') }}
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Peruuta
                </button>
                <button
                  onClick={handleSave}
                  disabled={!name.trim()}
                  className="flex-1 rounded-lg bg-gray-900 px-3 py-2 text-sm text-white transition-colors hover:bg-gray-700 disabled:opacity-40"
                >
                  Tallenna
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

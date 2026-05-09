'use client'

import { useEffect, useRef, useState } from 'react'
import {
  loadSavedQueries,
  persistSavedQueries,
  type Filters,
  type SavedQuery,
} from '@/lib/filters'
import type { OikotieLocation } from '@/lib/locations'

interface Props {
  filters: Filters
  locations: OikotieLocation[]
  onLoad: (filters: Filters, locations: OikotieLocation[]) => void
}

function filtersEqual(a: Filters, b: Filters) {
  return JSON.stringify(a) === JSON.stringify(b)
}

export default function SavedQueries({ filters, locations, onLoad }: Props) {
  const [queries, setQueries] = useState<SavedQuery[]>([])
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setQueries(loadSavedQueries())
  }, [])

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
        setSaving(false)
        setName('')
      }
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [])

  function handleSave() {
    const trimmed = name.trim()
    if (!trimmed) return
    const query: SavedQuery = {
      id: crypto.randomUUID(),
      name: trimmed,
      filters,
      locations,
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
    <div ref={ref} className="flex items-center gap-2">
      {/* Dropdown: list of saved queries */}
      <div className="relative">
        <button
          onClick={() => {
            setOpen((o) => !o)
            setSaving(false)
          }}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-sm transition-colors ${
            open
              ? 'border-gray-900 bg-gray-900 text-white'
              : 'border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Tallennetut haut
          {queries.length > 0 && (
            <span
              className={`text-xs font-semibold rounded-full w-4 h-4 flex items-center justify-center leading-none ${
                open ? 'bg-white text-gray-900' : 'bg-gray-200 text-gray-600'
              }`}
            >
              {queries.length}
            </span>
          )}
          <svg
            className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`}
            viewBox="0 0 12 12"
            fill="none"
          >
            <path
              d="M2 4l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {open && (
          <div className="absolute top-full mt-2 left-0 z-30 w-64 rounded-2xl bg-white shadow-xl border border-gray-100 overflow-hidden">
            {queries.length === 0 ? (
              <p className="px-4 py-3 text-sm text-gray-400">Ei tallennettuja hakuja</p>
            ) : (
              <ul className="divide-y divide-gray-100 max-h-56 overflow-y-auto">
                {queries.map((q) => (
                  <li
                    key={q.id}
                    className="group flex items-center justify-between gap-2 px-4 py-2.5 hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      onLoad(q.filters, q.locations ?? [])
                      setOpen(false)
                    }}
                  >
                    <span className="text-sm text-gray-800 truncate">{q.name}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(q.id)
                      }}
                      aria-label={`Poista ${q.name}`}
                      className="shrink-0 text-red-400 hover:text-red-600 leading-none"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Save button — only shown when current filters aren't already saved */}
      {!isAlreadySaved && (
        <div className="relative">
          <button
            onClick={() => {
              setSaving((s) => !s)
              setOpen(false)
            }}
            className={`flex items-center px-3 py-1 rounded-full border text-sm transition-colors ${
              saving
                ? 'border-gray-900 bg-gray-900 text-white'
                : 'border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            + Tallenna haku
          </button>

          {saving && (
            <div className="absolute top-full mt-2 left-0 z-30 w-64 rounded-2xl bg-white shadow-xl border border-gray-100 p-4">
              <p className="mb-3 text-sm font-medium text-gray-900">Tallenna haku</p>
              <input
                type="text"
                autoFocus
                placeholder="Nimi haulle…"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave()
                  if (e.key === 'Escape') {
                    setSaving(false)
                    setName('')
                  }
                }}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-gray-900 focus:outline-none"
              />
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => {
                    setSaving(false)
                    setName('')
                  }}
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

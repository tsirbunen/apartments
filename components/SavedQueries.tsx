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

export default function SavedQueries({ filters, onLoad }: Props) {
  const [queries, setQueries] = useState<SavedQuery[]>([])
  const [saving, setSaving] = useState(false)
  const [listOpen, setListOpen] = useState(false)
  const [name, setName] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setQueries(loadSavedQueries())
  }, [])

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setSaving(false)
        setListOpen(false)
      }
    }
    if (saving || listOpen) document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [saving, listOpen])

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

  function handleLoad(q: SavedQuery) {
    onLoad(q.filters)
    setListOpen(false)
  }

  return (
    <div ref={ref} className="flex gap-2">
      {/* Save button */}
      <div className="relative">
        <button
          onClick={() => {
            setSaving((s) => !s)
            setListOpen(false)
          }}
          className={`flex items-center px-3 py-1.5 rounded-full border text-sm transition-colors ${
            saving
              ? 'border-gray-900 bg-gray-900 text-white'
              : 'border-gray-300 text-gray-700 hover:border-gray-500'
          }`}
        >
          Tallenna haku
        </button>

        {saving && (
          <div className="absolute top-full mt-2 left-0 z-20 w-72 rounded-2xl border border-gray-200 bg-white p-4 shadow-lg">
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

      {/* Saved list button */}
      {queries.length > 0 && (
        <div className="relative">
          <button
            onClick={() => {
              setListOpen((o) => !o)
              setSaving(false)
            }}
            className={`flex items-center px-3 py-1.5 rounded-full border text-sm transition-colors ${
              listOpen
                ? 'border-gray-900 bg-gray-900 text-white'
                : 'border-gray-300 text-gray-700 hover:border-gray-500'
            }`}
          >
            Tallennetut ({queries.length})
          </button>

          {listOpen && (
            <div className="absolute top-full mt-2 left-0 z-20 w-64 rounded-2xl border border-gray-200 bg-white shadow-lg overflow-hidden">
              {queries.map((q) => (
                <div
                  key={q.id}
                  className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50"
                >
                  <button
                    className="flex-1 text-left text-sm text-gray-900 truncate"
                    onClick={() => handleLoad(q)}
                  >
                    {q.name}
                  </button>
                  <button
                    onClick={() => handleDelete(q.id)}
                    className="shrink-0 text-red-400 hover:text-red-600 leading-none"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

'use client'

import { useEffect, useRef, useState } from 'react'

interface PriceRange {
  min: number | null
  max: number | null
}

export default function PriceFilter({ onOpenChange }: { onOpenChange?: (open: boolean) => void }) {
  const [open, setOpen] = useState(false)
  const [applied, setApplied] = useState<PriceRange>({ min: null, max: null })
  const [draft, setDraft] = useState<PriceRange>({ min: null, max: null })
  const ref = useRef<HTMLDivElement>(null)

  function changeOpen(next: boolean) {
    setOpen(next)
    onOpenChange?.(next)
  }

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) changeOpen(false)
    }
    if (open) document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [open])

  function handleOpen() {
    setDraft(applied)
    changeOpen(true)
  }

  function handleApply() {
    setApplied(draft)
    changeOpen(false)
  }

  function handleClear() {
    const empty = { min: null, max: null }
    setDraft(empty)
    setApplied(empty)
    changeOpen(false)
  }

  const isActive = applied.min !== null || applied.max !== null

  function buttonLabel() {
    if (!isActive) return 'Hinta'
    const fmt = (n: number) => n.toLocaleString('fi-FI') + ' €'
    if (applied.min !== null && applied.max !== null)
      return `${fmt(applied.min)} - ${fmt(applied.max)}`
    if (applied.min !== null) return `${fmt(applied.min)} -`
    return `- ${fmt(applied.max!)}`
  }

  function fmt(n: number | null) {
    return n !== null ? n.toLocaleString('fi-FI') : ''
  }

  function parseInput(raw: string): number | null {
    const digits = raw.replace(/\D/g, '')
    return digits ? Number(digits) : null
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={handleOpen}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-full border text-sm transition-colors ${
          isActive
            ? 'border-gray-900 bg-gray-900 text-white'
            : 'border-gray-300 text-gray-700 hover:border-gray-500'
        }`}
      >
        {buttonLabel()}
        {isActive && (
          <span
            role="button"
            aria-label="Tyhjennä hintasuodatin"
            onClick={(e) => {
              e.stopPropagation()
              handleClear()
            }}
            className="ml-0.5 text-red-400 hover:text-red-300 leading-none"
          >
            ×
          </span>
        )}
      </button>

      {open && (
        <div className="absolute top-full mt-2 left-0 z-20 min-w-64 rounded-2xl border border-gray-200 bg-white p-4 shadow-lg">
          <p className="mb-3 text-sm font-medium text-gray-900">Hintahaarukka</p>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="mb-1 block text-xs text-gray-500">Min €</label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="Ei alarajaa"
                value={fmt(draft.min)}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, min: parseInput(e.target.value) }))
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-gray-900 focus:outline-none"
              />
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-xs text-gray-500">Max €</label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="Ei ylärajaa"
                value={fmt(draft.max)}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, max: parseInput(e.target.value) }))
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-gray-900 focus:outline-none"
              />
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <button
              onClick={handleClear}
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
            >
              Tyhjennä
            </button>
            <button
              onClick={handleApply}
              className="flex-1 rounded-lg bg-gray-900 px-3 py-2 text-sm text-white transition-colors hover:bg-gray-700"
            >
              Hae
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

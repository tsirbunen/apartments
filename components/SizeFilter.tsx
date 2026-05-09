'use client'

import { useEffect, useRef, useState } from 'react'
import type { Filters } from '@/lib/filters'

type SizeRange = Filters['size']

interface Props {
  value: SizeRange
  onChange: (value: SizeRange) => void
  onOpenChange?: (open: boolean) => void
}

export default function SizeFilter({ value, onChange, onOpenChange }: Props) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<SizeRange>(value)
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
    setDraft(value)
    changeOpen(true)
  }

  function handleApply() {
    onChange(draft)
    changeOpen(false)
  }

  function handleClear() {
    onChange({ min: null, max: null })
    changeOpen(false)
  }

  const isActive = value.min !== null || value.max !== null

  function buttonLabel() {
    if (!isActive) return 'Koko'
    const fmt = (n: number) => n.toLocaleString('fi-FI') + ' m²'
    if (value.min !== null && value.max !== null)
      return `${fmt(value.min)} ... ${fmt(value.max)}`
    if (value.min !== null) return `min ${fmt(value.min)}`
    return `max ${fmt(value.max!)}`
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={handleOpen}
        className={`flex items-center gap-1 px-3 py-1 rounded-full border text-sm transition-colors ${
          isActive
            ? 'border-gray-900 bg-gray-900 text-white'
            : 'border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        {buttonLabel()}
        {isActive && (
          <span
            role="button"
            aria-label="Tyhjennä kokosuodatin"
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
        <div className="absolute top-full mt-2 z-20 left-0 sm:left-1/2 sm:-translate-x-1/2 min-w-64 rounded-2xl bg-white p-4 shadow-xl">
          <p className="mb-3 text-sm font-medium text-gray-900">Kokohaarukka</p>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="mb-1 block text-xs text-gray-500">Min m²</label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="Ei alarajaa"
                value={draft.min ?? ''}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, '')
                  setDraft((d) => ({ ...d, min: v ? Number(v) : null }))
                }}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-gray-900 focus:outline-none"
              />
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-xs text-gray-500">Max m²</label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="Ei ylärajaa"
                value={draft.max ?? ''}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, '')
                  setDraft((d) => ({ ...d, max: v ? Number(v) : null }))
                }}
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

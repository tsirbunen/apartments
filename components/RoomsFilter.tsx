'use client'

import { useEffect, useRef, useState } from 'react'

const OPTIONS = [1, 2, 3, 4, 5] as const
const LABEL = (n: number) => (n === 5 ? '5+' : String(n))

interface Props {
  value: number[]
  onChange: (value: number[]) => void
  onOpenChange?: (open: boolean) => void
}

export default function RoomsFilter({ value, onChange, onOpenChange }: Props) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<Set<number>>(new Set(value))
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
    setDraft(new Set(value))
    changeOpen(true)
  }

  function handleApply() {
    onChange([...draft].sort((a, b) => a - b))
    changeOpen(false)
  }

  function handleClear() {
    onChange([])
    changeOpen(false)
  }

  function toggleDraft(n: number) {
    setDraft((d) => {
      const next = new Set(d)
      next.has(n) ? next.delete(n) : next.add(n)
      return next
    })
  }

  const isActive = value.length > 0

  function buttonLabel() {
    if (!isActive) return 'Huoneet'
    const sorted = [...value].sort((a, b) => a - b)
    const isRange =
      sorted.length > 1 &&
      sorted.every((n, i) => i === 0 || n === sorted[i - 1] + 1)
    if (isRange) return `${LABEL(sorted[0])}-${LABEL(sorted[sorted.length - 1])}h`
    return sorted.map((n) => LABEL(n) + 'h').join(', ')
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
            aria-label="Tyhjennä huonesuodatin"
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
        <div className="absolute top-full mt-2 z-20 left-0 sm:left-1/2 sm:-translate-x-1/2 rounded-2xl bg-white p-4 shadow-xl">
          <p className="mb-3 text-sm font-medium text-gray-900">Huoneet</p>
          <div className="flex gap-2">
            {OPTIONS.map((n) => {
              const selected = draft.has(n)
              return (
                <button
                  key={n}
                  onClick={() => toggleDraft(n)}
                  className={`w-10 h-10 rounded-full border text-sm font-medium transition-colors ${
                    selected
                      ? 'border-gray-900 bg-gray-900 text-white'
                      : 'border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {LABEL(n)}
                </button>
              )
            })}
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

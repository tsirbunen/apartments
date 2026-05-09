'use client'

import { useEffect, useRef, useState } from 'react'

const OPTIONS = [1, 2, 3, 4, 5] as const
const LABEL = (n: number) => (n === 5 ? '5+' : String(n))

export default function RoomsFilter({ onOpenChange }: { onOpenChange?: (open: boolean) => void }) {
  const [open, setOpen] = useState(false)
  const [applied, setApplied] = useState<Set<number>>(new Set())
  const [draft, setDraft] = useState<Set<number>>(new Set())
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
    setDraft(new Set(applied))
    changeOpen(true)
  }

  function handleApply() {
    setApplied(new Set(draft))
    changeOpen(false)
  }

  function handleClear() {
    setDraft(new Set())
    setApplied(new Set())
    changeOpen(false)
  }

  function toggleDraft(n: number) {
    setDraft((d) => {
      const next = new Set(d)
      next.has(n) ? next.delete(n) : next.add(n)
      return next
    })
  }

  const isActive = applied.size > 0

  function buttonLabel() {
    if (!isActive) return 'Huoneet'
    const sorted = [...applied].sort((a, b) => a - b)
    return sorted.map(LABEL).join(', ') + ' h'
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
        <div className="absolute top-full mt-2 left-0 z-20 rounded-2xl border border-gray-200 bg-white p-4 shadow-lg">
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
                      : 'border-gray-300 text-gray-700 hover:border-gray-500'
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

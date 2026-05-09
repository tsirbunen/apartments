'use client'

import { useEffect, useRef, useState } from 'react'
import type { OikotieLocation } from '@/lib/locations'

interface LocationResult {
  id: number
  level: number
  name: string
}

interface Props {
  onSelect: (location: OikotieLocation) => void
  placeholder?: string
}

export default function LocationPicker({
  onSelect,
  placeholder = '+ lisää sijainti'
}: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<LocationResult[]>([])
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current)
    if (query.length < 2) {
      setResults([])
      setOpen(false)
      return
    }
    timer.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/locations?q=${encodeURIComponent(query)}`)
        const data: LocationResult[] = await res.json()
        setResults(data)
        setOpen(data.length > 0)
      } catch {
        setResults([])
        setOpen(false)
      }
    }, 300)
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [query])

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [])

  function handleSelect(loc: LocationResult) {
    onSelect([loc.id, loc.level, loc.name])
    setQuery('')
    setResults([])
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
        placeholder={placeholder}
        className="w-44 rounded-full ring-1 ring-dashed ring-gray-300 px-3 py-1 text-sm text-gray-700 placeholder:text-gray-400 focus:ring-gray-500 focus:outline-none bg-gray-100"
      />

      {open && (
        <ul className="absolute top-full mt-1 left-0 z-50 w-64 rounded-xl bg-white shadow-lg border border-gray-100 overflow-hidden">
          {results.map((loc) => (
            <li
              key={`${loc.id}-${loc.level}`}
              onMouseDown={(e) => {
                e.preventDefault()
                handleSelect(loc)
              }}
              className="px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer truncate"
            >
              {loc.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

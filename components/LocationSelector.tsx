'use client'

import { useRef, useState } from 'react'

interface Props {
  locations: string[]
  onChange: (locations: string[]) => void
}

export default function LocationSelector({ locations, onChange }: Props) {
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  function add() {
    const trimmed = input.trim().replace(/^\w/, (c) => c.toUpperCase())
    if (!trimmed || locations.includes(trimmed)) {
      setInput('')
      return
    }
    onChange([...locations, trimmed])
    setInput('')
  }

  function remove(loc: string) {
    onChange(locations.filter((l) => l !== loc))
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      add()
    } else if (e.key === 'Backspace' && input === '' && locations.length > 0) {
      onChange(locations.slice(0, -1))
    }
  }

  return (
    <div
      className="flex flex-wrap items-center gap-2 cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      {locations.map((loc) => (
        <span
          key={loc}
          className="flex items-center gap-1 rounded-full bg-gray-900 px-3 py-1 text-sm font-bold text-white"
        >
          {loc}
          <button
            onClick={(e) => {
              e.stopPropagation()
              remove(loc)
            }}
            aria-label={`Poista ${loc}`}
            className="ml-0.5 text-red-400 hover:text-red-300 leading-none"
          >
            ×
          </button>
        </span>
      ))}

      <input
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={add}
        placeholder={'+ muu kaupunginosa'}
        className="w-48 rounded-full ring-1 ring-dashed ring-gray-300 px-2.5 py-2.5 text-xs text-gray-700 placeholder:text-gray-400 focus:ring-gray-500 focus:outline-none bg-transparent"
      />
    </div>
  )
}

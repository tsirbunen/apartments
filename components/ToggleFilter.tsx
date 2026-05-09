'use client'

import { useState } from 'react'

export default function ToggleFilter({ label }: { label: string }) {
  const [active, setActive] = useState(false)

  return (
    <button
      onClick={() => setActive((a) => !a)}
      className={`flex items-center gap-1 px-3 py-1.5 rounded-full border text-sm transition-colors ${
        active
          ? 'border-gray-900 bg-gray-900 text-white'
          : 'border-gray-300 text-gray-700 hover:border-gray-500'
      }`}
    >
      {label}
      {active && (
        <span
          role="button"
          aria-label={`Clear ${label} filter`}
          onClick={(e) => {
            e.stopPropagation()
            setActive(false)
          }}
          className="ml-0.5 text-red-400 hover:text-red-300 leading-none"
        >
          ×
        </span>
      )}
    </button>
  )
}

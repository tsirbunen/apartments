'use client'

import type { OikotieLocation } from '@/lib/locations'
import LocationPicker from './LocationPicker'

interface Props {
  locations: OikotieLocation[]
  onChange: (locations: OikotieLocation[]) => void
}

export default function LocationSelector({ locations, onChange }: Props) {
  function remove(id: number) {
    onChange(locations.filter((l) => l[0] !== id))
  }

  function add(loc: OikotieLocation) {
    if (locations.some((l) => l[0] === loc[0])) return
    onChange([...locations, loc])
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {locations.map((loc) => (
        <span
          key={loc[0]}
          className="flex items-center gap-1 rounded-full bg-gray-900 px-3 py-1 text-sm font-bold text-white"
        >
          {loc[2].replace(/, Helsinki$/, '')}
          <button
            onClick={() => remove(loc[0])}
            aria-label={`Poista ${loc[2]}`}
            className="ml-0.5 text-red-400 hover:text-red-300 leading-none"
          >
            ×
          </button>
        </span>
      ))}

      <LocationPicker onSelect={add} />
    </div>
  )
}

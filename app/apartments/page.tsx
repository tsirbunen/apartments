'use client'

import { useEffect, useState } from 'react'
import type { OikotieCard } from '@/services/oikotie'
import { DEFAULT_FILTERS, type Filters } from '@/lib/filters'
import ApartmentCard from '@/components/ApartmentCard'
import PriceFilter from '@/components/PriceFilter'
import SizeFilter from '@/components/SizeFilter'
import ToggleFilter from '@/components/ToggleFilter'
import RoomsFilter from '@/components/RoomsFilter'
import SavedQueries from '@/components/SavedQueries'

export default function ApartmentsPage() {
  const [cards, setCards] = useState<OikotieCard[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [openCount, setOpenCount] = useState(0)
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)

  function handleOpenChange(delta: 1 | -1) {
    setOpenCount((c) => Math.max(0, c + delta))
  }

  function updateFilter<K extends keyof Filters>(key: K, value: Filters[K]) {
    setFilters((f) => ({ ...f, [key]: value }))
  }

  useEffect(() => {
    fetch('/api/listings')
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`)
        return res.json()
      })
      .then(setCards)
      .catch((e) => setError(e instanceof Error ? e.message : 'Unknown error'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      {openCount > 0 && (
        <div className="fixed inset-0 z-10 bg-black/50 pointer-events-none" />
      )}

      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Lauttasaari, Helsinki
        </h1>

        <div className="relative z-20 mb-6 flex flex-wrap gap-2">
          <PriceFilter
            value={filters.price}
            onChange={(v) => updateFilter('price', v)}
            onOpenChange={(o) => handleOpenChange(o ? 1 : -1)}
          />
          <RoomsFilter
            value={filters.rooms}
            onChange={(v) => updateFilter('rooms', v)}
            onOpenChange={(o) => handleOpenChange(o ? 1 : -1)}
          />
          <SizeFilter
            value={filters.size}
            onChange={(v) => updateFilter('size', v)}
            onOpenChange={(o) => handleOpenChange(o ? 1 : -1)}
          />
          <ToggleFilter
            label="Oma tontti"
            value={filters.omaTontti}
            onChange={(v) => updateFilter('omaTontti', v)}
          />
          <ToggleFilter
            label="Uudiskohde"
            value={filters.uudiskohde}
            onChange={(v) => updateFilter('uudiskohde', v)}
          />

          <div className="ml-auto">
            <SavedQueries
              filters={filters}
              onLoad={(f) => setFilters(f)}
            />
          </div>
        </div>

        <p className="text-gray-500 mb-8 text-sm">
          {error ? (
            <span className="text-red-500">Error: {error}</span>
          ) : loading ? (
            'Loading…'
          ) : (
            `${cards.length} apartment${cards.length !== 1 ? 's' : ''} · ≤ 800 000 € · ≥ 74 m² · 2–4 rooms · own lot`
          )}
        </p>

        {!error && !loading && cards.length === 0 && (
          <p className="text-gray-400">No apartments found.</p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {cards.map((card) => (
            <ApartmentCard key={card.id} card={card} />
          ))}
        </div>
      </div>
    </div>
  )
}

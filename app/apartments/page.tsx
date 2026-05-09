'use client'

import { useEffect, useState } from 'react'
import type { OikotieCard } from '@/services/oikotie'
import { DEFAULT_FILTERS, type Filters } from '@/lib/filters'
import { DEFAULT_LOCATIONS, type OikotieLocation } from '@/lib/locations'
import ApartmentCard from '@/components/ApartmentCard'
import PriceFilter from '@/components/PriceFilter'
import SizeFilter from '@/components/SizeFilter'
import ToggleFilter from '@/components/ToggleFilter'
import RoomsFilter from '@/components/RoomsFilter'
import SavedQueries from '@/components/SavedQueries'
import LocationSelector from '@/components/LocationSelector'

export default function ApartmentsPage() {
  const [cards, setCards] = useState<OikotieCard[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [openCount, setOpenCount] = useState(0)
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)
  const [locations, setLocations] = useState<OikotieLocation[]>(DEFAULT_LOCATIONS)
  const [filtersOpen, setFiltersOpen] = useState(true)

  function handleOpenChange(delta: 1 | -1) {
    setOpenCount((c) => Math.max(0, c + delta))
  }

  function updateFilter<K extends keyof Filters>(key: K, value: Filters[K]) {
    setFilters((f) => ({ ...f, [key]: value }))
  }

  function filterChips(): string[] {
    const chips: string[] = []
    locations.forEach((l) => chips.push(l[2].replace(/, Helsinki$/, '')))
    const { price, size, rooms, omaTontti, uudiskohde } = filters
    const fmtEur = (n: number) => n.toLocaleString('fi-FI') + ' €'
    const fmtSqm = (n: number) => n.toLocaleString('fi-FI') + ' m²'
    if (price.min != null && price.max != null)
      chips.push(`${fmtEur(price.min)}–${fmtEur(price.max)}`)
    else if (price.min != null) chips.push(`min ${fmtEur(price.min)}`)
    else if (price.max != null) chips.push(`max ${fmtEur(price.max)}`)
    if (rooms.length > 0) {
      const s = [...rooms].sort((a, b) => a - b)
      const isRange =
        s.length > 1 && s.every((n, i) => i === 0 || n === s[i - 1] + 1)
      chips.push(
        isRange
          ? `${s[0]}-${s[s.length - 1]}h`
          : s.map((n) => n + 'h').join(', ')
      )
    }
    if (size.min != null && size.max != null)
      chips.push(`${fmtSqm(size.min)}–${fmtSqm(size.max)}`)
    else if (size.min != null) chips.push(`min ${fmtSqm(size.min)}`)
    else if (size.max != null) chips.push(`max ${fmtSqm(size.max)}`)
    if (omaTontti) chips.push('Oma tontti')
    if (uudiskohde) chips.push('Uudiskohde')
    return chips
  }

  useEffect(() => {
    const params = new URLSearchParams()
    if (filters.price.min != null)
      params.set('priceMin', String(filters.price.min))
    if (filters.price.max != null)
      params.set('priceMax', String(filters.price.max))
    if (filters.size.min != null)
      params.set('sizeMin', String(filters.size.min))
    if (filters.size.max != null)
      params.set('sizeMax', String(filters.size.max))
    filters.rooms.forEach((r) => params.append('rooms', String(r)))
    if (filters.omaTontti) params.set('omaTontti', '1')
    if (filters.uudiskohde) params.set('uudiskohde', '1')
    if (locations.length > 0) params.set('locations', JSON.stringify(locations))

    const qs = params.toString()
    setLoading(true)
    setError(null)

    async function load() {
      try {
        const res = await fetch(`/api/apartments${qs ? `?${qs}` : ''}`)
        if (!res.ok) throw new Error(`Request failed: ${res.status}`)
        setCards(await res.json())
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [filters, locations])

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-3">
      {openCount > 0 && (
        <div className="fixed inset-0 z-10 bg-black/50 pointer-events-none" />
      )}

      <div className="max-w-6xl mx-auto">
        <div className="relative mb-5">
          <button
            onClick={() => setFiltersOpen((o) => !o)}
            className="absolute top-0 right-0 text-gray-400 hover:text-gray-700"
            aria-label={
              filtersOpen ? 'Sulje suodattimet' : 'Muokkaa suodattimia'
            }
          >
            {filtersOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="8" y1="12" x2="16" y2="12" />
                <line x1="11" y1="18" x2="13" y2="18" />
              </svg>
            )}
          </button>

          {filtersOpen ? (
            <>
              <div className="mb-5">
                <p className="mb-1.5 text-xs font-bold text-gray-400 uppercase tracking-wide">
                  Sijainti
                </p>
                <LocationSelector
                  locations={locations}
                  onChange={setLocations}
                />
              </div>

              <div className="relative z-30 mb-5">
                <p className="mb-1.5 text-xs font-bold text-gray-400 uppercase tracking-wide">
                  Rajaa hakua
                </p>
                <div className="flex flex-wrap gap-2">
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
                </div>
              </div>

              <div className="relative z-10">
                <p className="mb-1.5 text-xs font-bold text-gray-400 uppercase tracking-wide">
                  Tallennetut haut
                </p>
                <SavedQueries filters={filters} onLoad={(f) => setFilters(f)} />
              </div>
            </>
          ) : (
            <div
              className="flex flex-wrap gap-1.5 pr-8 cursor-pointer"
              onClick={() => setFiltersOpen(true)}
            >
              {filterChips().length === 0 ? (
                <span className="text-sm text-gray-400">Ei rajauksia</span>
              ) : (
                filterChips().map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full bg-gray-200 px-3 py-1 text-xs text-gray-500"
                  >
                    {chip}
                  </span>
                ))
              )}
            </div>
          )}
        </div>

        <p className="text-gray-500 mb-4 text-sm">
          {error ? (
            <span className="text-red-500">Error: {error}</span>
          ) : loading ? (
            'Ladataan…'
          ) : (
            `${cards.length} kohdetta`
          )}
        </p>

        {!error && !loading && cards.length === 0 && (
          <p className="text-gray-400">Ei asuntoja.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {cards.map((card) => (
            <ApartmentCard key={card.id} card={card} />
          ))}
        </div>
      </div>
    </div>
  )
}

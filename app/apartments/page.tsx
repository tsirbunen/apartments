'use client'

import { useEffect, useState } from 'react'
import type { OikotieCard } from '@/services/oikotie'
import ApartmentCard from '@/components/ApartmentCard'

export default function ApartmentsPage() {
  const [cards, setCards] = useState<OikotieCard[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

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
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Lauttasaari, Helsinki
        </h1>
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

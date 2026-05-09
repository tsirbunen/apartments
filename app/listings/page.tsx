'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { OikotieCard } from '@/services/oikotie'

function parsePriceEur(price: string): number | null {
  const digits = price.replace(/[^\d]/g, '')
  return digits ? parseInt(digits, 10) : null
}

export default function ListingsPage() {
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
        <Link href="/" className="text-xs text-gray-400 hover:text-gray-600 mb-6 inline-block">
          ← Back
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Lauttasaari, Helsinki
        </h1>
        <p className="text-gray-500 mb-8 text-sm">
          {error ? (
            <span className="text-red-500">Error: {error}</span>
          ) : loading ? (
            'Loading…'
          ) : (
            `${cards.length} listing${cards.length !== 1 ? 's' : ''} · ≤ 800 000 € · ≥ 74 m² · 2–4 rooms · own lot`
          )}
        </p>

        {!error && !loading && cards.length === 0 && (
          <p className="text-gray-400">No listings found.</p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {cards.map((card) => {
            const imageUrl =
              card.images?.cardDesktopWebP ?? card.images?.wide ?? null
            const numericPrice = parsePriceEur(card.price)
            const pricePerSqm =
              numericPrice && card.size
                ? Math.round(numericPrice / card.size).toLocaleString('fi-FI')
                : null
            const bd = card.buildingData
            const floorInfo =
              bd?.floor != null && bd?.floorCount != null
                ? `${bd.floor}/${bd.floorCount} krs`
                : null
            return (
              <a
                key={card.id}
                href={card.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-md transition-shadow flex flex-col"
              >
                {imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imageUrl}
                    alt={card.description}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                    No image
                  </div>
                )}
                <div className="p-3 flex flex-col gap-0.5 flex-1">
                  <p className="text-sm font-semibold text-gray-900">
                    {card.price}
                    {pricePerSqm && (
                      <span className="text-xs font-normal text-gray-500 ml-2">
                        – {pricePerSqm} €/m²
                      </span>
                    )}
                  </p>
                  {card.roomConfiguration && (
                    <p className="text-xs text-gray-700">
                      {card.roomConfiguration}
                    </p>
                  )}
                  {card.size && (
                    <p className="text-xs text-gray-700">
                      <span className="font-semibold">{card.size} m²</span>
                      {bd?.address && (
                        <span className="font-normal text-gray-500 ml-1">
                          – {bd.address}
                        </span>
                      )}
                    </p>
                  )}
                  {(floorInfo || bd?.year) && (
                    <p className="text-xs text-gray-600">
                      {floorInfo}
                      {floorInfo && bd?.year && ' – '}
                      {bd?.year && bd.year}
                    </p>
                  )}
                  {card.brand?.name && (
                    <p className="text-xs text-gray-400 mt-auto pt-1.5 line-clamp-1">
                      {card.brand.name}
                    </p>
                  )}
                </div>
              </a>
            )
          })}
        </div>
      </div>
    </div>
  )
}

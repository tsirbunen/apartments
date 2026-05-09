import type { OikotieCard } from '@/services/oikotie'

function parsePriceEur(price: string): number | null {
  const digits = price.replace(/[^\d]/g, '')
  return digits ? parseInt(digits, 10) : null
}

export default function ApartmentCard({ card }: { card: OikotieCard }) {
  const imageUrl = card.images?.cardDesktopWebP ?? card.images?.wide ?? null
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
          <p className="text-xs text-gray-700">{card.roomConfiguration}</p>
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
}

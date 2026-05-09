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
      ? `${bd.floor}/${bd.floorCount}`
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
          className="w-full h-64 object-cover"
        />
      ) : (
        <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
          No image
        </div>
      )}
      <div className="p-3 flex flex-col gap-0.5 flex-1">
        <div className="flex justify-between items-baseline">
          <span className="text-sm font-semibold text-gray-900">{card.price}</span>
          {pricePerSqm && (
            <span className="text-xs text-gray-500">{pricePerSqm} €/m²</span>
          )}
        </div>
        {card.size && (
          <div className="flex justify-between items-baseline">
            <span className="text-xs font-semibold text-gray-700">{card.size} m²</span>
            {bd?.address && (
              <span className="text-xs text-gray-500">{bd.address}</span>
            )}
          </div>
        )}
        {(card.roomConfiguration || floorInfo || bd?.year) && (
          <div className="flex justify-between items-baseline">
            {card.roomConfiguration ? (
              <span className="text-xs font-bold text-gray-700">
                {card.roomConfiguration.match(/^\d+[hH]/)?.[0] ?? card.roomConfiguration.split(',')[0].trim()}
              </span>
            ) : <span />}
            <span className="text-xs text-gray-600">
              {floorInfo}
              {floorInfo && bd?.year && ' – '}
              {bd?.year}
            </span>
          </div>
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

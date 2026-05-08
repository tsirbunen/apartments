import { searchListings } from "@/lib/oikotie";

export const revalidate = 600;

export default async function Home() {
  let cards: Awaited<ReturnType<typeof searchListings>> = [];
  let error: string | null = null;

  try {
    cards = await searchListings({
      cardType: 100,
      locations: JSON.stringify([[1669, 4, "Lauttasaari, Helsinki"]]),
      habitationType: ["1"],
      lotOwnershipType: ["1"],
      "price[max]": 800000,
      "size[min]": 74,
      roomCount: ["2", "3", "4"],
      limit: 24,
      offset: 0,
      sortBy: "published_sort_desc",
    });
  } catch (e) {
    error = e instanceof Error ? e.message : "Unknown error";
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Lauttasaari, Helsinki
        </h1>
        <p className="text-gray-500 mb-8 text-sm">
          {error ? (
            <span className="text-red-500">Error: {error}</span>
          ) : (
            `${cards.length} listing${cards.length !== 1 ? "s" : ""} · ≤ 800 000 € · ≥ 74 m² · 2–4 rooms · own lot`
          )}
        </p>

        {!error && cards.length === 0 && (
          <p className="text-gray-400">No listings found.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => {
            const imageUrl = card.images?.wide ?? null;
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
                <div className="p-4 flex flex-col gap-1 flex-1">
                  <p className="text-lg font-semibold text-gray-900">
                    {card.price}
                  </p>
                  <p className="text-sm text-gray-600">
                    {[
                      card.roomConfiguration,
                      card.size ? `${card.size} m²` : null,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {card.description}
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}

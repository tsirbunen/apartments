import { searchListings } from "@/services/oikotie";

export const revalidate = 600;

export async function GET() {
  const cards = await searchListings({
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

  return Response.json(cards);
}

import { type NextRequest } from 'next/server'
import { searchListings } from '@/services/oikotie'

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams

  const params: Record<string, string | number | string[]> = {
    cardType: 100,
    locations: JSON.stringify([[1669, 4, 'Lauttasaari, Helsinki']]),
    habitationType: ['1'],
    limit: 24,
    offset: 0,
    sortBy: 'published_sort_desc',
  }

  const priceMin = sp.get('priceMin')
  const priceMax = sp.get('priceMax')
  const sizeMin = sp.get('sizeMin')
  const sizeMax = sp.get('sizeMax')
  const rooms = sp.getAll('rooms')
  const omaTontti = sp.get('omaTontti')

  if (priceMin) params['price[min]'] = Number(priceMin)
  if (priceMax) params['price[max]'] = Number(priceMax)
  if (sizeMin) params['size[min]'] = Number(sizeMin)
  if (sizeMax) params['size[max]'] = Number(sizeMax)
  if (rooms.length > 0) params.roomCount = rooms
  if (omaTontti === '1') params.lotOwnershipType = ['1']

  const cards = await searchListings(params)
  return Response.json(cards)
}

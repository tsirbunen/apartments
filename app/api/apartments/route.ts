import { type NextRequest } from 'next/server'
import { searchListings } from '@/services/oikotie'

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams

  const locParam = sp.get('locations')
  let locations = [[1669, 4, 'Lauttasaari, Helsinki']]
  if (locParam) {
    try {
      const parsed = JSON.parse(locParam)
      if (Array.isArray(parsed) && parsed.length > 0) locations = parsed
    } catch {}
  }

  const params: Record<string, string | number | string[]> = {
    cardType: 100,
    locations: JSON.stringify(locations),
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
  const uudiskohde = sp.get('uudiskohde')

  if (priceMin) params['price[min]'] = Number(priceMin)
  if (priceMax) params['price[max]'] = Number(priceMax)
  if (sizeMin) params['size[min]'] = Number(sizeMin)
  if (sizeMax) params['size[max]'] = Number(sizeMax)
  if (rooms.length > 0) params.roomCount = rooms
  if (omaTontti === '1') params.lotOwnershipType = ['1']
  if (uudiskohde === '1') params.conditionType = ['32']

  const cards = await searchListings(params)
  return Response.json(cards)
}

import { type NextRequest } from 'next/server'
import { getTokens } from '@/services/oikotie'

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q') ?? ''
  if (q.length < 2) return Response.json([])

  const tokens = await getTokens()
  const url = `https://asunnot.oikotie.fi/api/3.0/location?query=${encodeURIComponent(q)}`

  const res = await fetch(url, {
    headers: {
      'OTA-token': tokens.token,
      'OTA-loaded': tokens.loaded,
      'OTA-cuid': tokens.cuid,
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      Accept: 'application/json',
    },
  })

  if (!res.ok) return Response.json([])

  const data: {
    card: { cardId: number; cardType: number; name: string }
    parent?: { name: string }
  }[] = await res.json()

  return Response.json(
    data.map((item) => {
      const name = item.parent?.name
        ? `${item.card.name}, ${item.parent.name}`
        : item.card.name
      return { id: item.card.cardId, level: item.card.cardType, name }
    })
  )
}

export interface OikotieCard {
  id: number
  description: string
  price: string
  rooms: number
  roomConfiguration: string
  size: number
  url: string
  images?: {
    wide?: string
    cardDesktopWebP?: string
  }
  buildingData?: {
    address?: string
    district?: string
    city?: string
    country?: string
    year?: number
    buildingType?: number
    floor?: number
    floorCount?: number
  }
  brand?: {
    name?: string
  }
  cardType: number
}

interface OikotieTokens {
  token: string
  loaded: string
  cuid: string
}

export async function getTokens(): Promise<OikotieTokens> {
  const rand = Math.random().toString(36).slice(2)
  const res = await fetch(
    `https://asunnot.oikotie.fi/user/get?format=json&rand=${rand}`,
    {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Accept: 'application/json'
      }
    }
  )
  if (!res.ok) throw new Error(`Token fetch failed: ${res.status}`)
  const data = await res.json()
  return {
    token: data.user.token,
    loaded: String(data.user.time),
    cuid: data.user.cuid
  }
}

export async function searchListings(
  params: Record<string, string | number | string[]>
): Promise<OikotieCard[]> {
  const tokens = await getTokens()

  const qs = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value)) {
      for (const v of value) {
        qs.append(`${key}[]`, v)
      }
    } else {
      qs.set(key, String(value))
    }
  }

  const url = `https://asunnot.oikotie.fi/api/cards?${qs.toString()}`
  const res = await fetch(url, {
    headers: {
      'OTA-token': tokens.token,
      'OTA-loaded': tokens.loaded,
      'OTA-cuid': tokens.cuid,
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      Accept: 'application/json'
    }
  })

  if (!res.ok) throw new Error(`Listings fetch failed: ${res.status}`)
  const data = await res.json()
  return Array.isArray(data.cards) ? data.cards : []
}

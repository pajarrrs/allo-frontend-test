export interface RocketApiResponse {
  count: number
  next: string | null
  previous: string | null
  results: RocketRaw[]
}

export interface RocketRaw {
  id: number
  url: string
  name: string
  full_name: string
  description: string | null
  image_url: string | null
  launch_cost: string | null
  maiden_flight: string | null
  manufacturer: {
    name: string
    country_code: string | null
  } | null
}

export interface Rocket {
  id: number
  name: string
  description: string | null
  imageUrl: string | null
  launchCost: string | null
  maidenFlight: string | null
  countryCode: string | null
  isLocal?: boolean
}

export type NewRocket = Omit<Rocket, 'id' | 'isLocal'>

export function mapRocketRaw(raw: RocketRaw): Rocket {
  return {
    id: raw.id,
    name: raw.full_name,
    description: raw.description,
    imageUrl: raw.image_url,
    launchCost: raw.launch_cost,
    maidenFlight: raw.maiden_flight,
    countryCode: raw.manufacturer?.country_code ?? null,
  }
}

export type RocketFilter = 'has-image' | 'has-cost' | 'local'

export type RocketSort = 'name' | 'first-flight-asc' | 'first-flight-desc' | 'cost-asc' | 'cost-desc'

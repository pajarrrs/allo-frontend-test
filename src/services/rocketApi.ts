import axios from 'axios'
import type { RocketApiResponse, RocketRaw } from '@/types/rocket'

const BASE_URL = 'https://lldev.thespacedevs.com/2.2.0'
const MANUFACTURER = 'SpaceX'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
})

export async function fetchRockets(): Promise<RocketRaw[]> {
  const { data } = await api.get<RocketApiResponse>('/config/launcher/', {
    params: {
      manufacturer__name: MANUFACTURER,
      mode: 'detailed',
      limit: 20,
    },
  })
  return data.results
}

/**
 * Returns the rocket, or `null` when it doesn't exist or isn't a SpaceX rocket.
 */
export async function fetchRocketById(id: number): Promise<RocketRaw | null> {
  try {
    const { data } = await api.get<RocketRaw>(`/config/launcher/${id}/`, {
      params: { mode: 'detailed' },
    })
    return data.manufacturer?.name === MANUFACTURER ? data : null
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) return null
    throw error
  }
}

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.code === 'ECONNABORTED') return 'The request timed out. Please try again.'
    if (!error.response) return 'Network error. Please check your internet connection.'
    if (error.response.status === 429) return 'Too many requests. Please wait a moment and try again.'
    if (error.response.status >= 500) return 'The server is having problems. Please try again later.'
  }
  return 'Something went wrong. Please try again.'
}

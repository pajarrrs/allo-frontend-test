import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { fetchRockets, getErrorMessage } from '@/services/rocketApi'
import { mapRocketRaw } from '@/types/rocket'
import type { NewRocket, Rocket, RocketFilter, RocketSort } from '@/types/rocket'

const FILTER_PREDICATES: Record<RocketFilter, (rocket: Rocket) => boolean> = {
  'has-image': r => !!r.imageUrl,
  'has-cost': r => toNumber(r.launchCost) !== null,
  'local': r => !!r.isLocal,
}

function toNumber(value: string | null): number | null {
  const n = Number(value)
  return value && Number.isFinite(n) ? n : null
}

function toTime(value: string | null): number | null {
  const t = value ? Date.parse(value) : NaN
  return Number.isNaN(t) ? null : t
}

/** Ascending/descending compare that always puts missing values last */
function compareNullable(a: number | null, b: number | null, direction: 1 | -1): number {
  if (a === null && b === null) return 0
  if (a === null) return 1
  if (b === null) return -1
  return (a - b) * direction
}

const SORT_COMPARATORS: Record<RocketSort, (a: Rocket, b: Rocket) => number> = {
  'name': (a, b) => a.name.localeCompare(b.name),
  'first-flight-asc': (a, b) => compareNullable(toTime(a.maidenFlight), toTime(b.maidenFlight), 1),
  'first-flight-desc': (a, b) => compareNullable(toTime(a.maidenFlight), toTime(b.maidenFlight), -1),
  'cost-asc': (a, b) => compareNullable(toNumber(a.launchCost), toNumber(b.launchCost), 1),
  'cost-desc': (a, b) => compareNullable(toNumber(a.launchCost), toNumber(b.launchCost), -1),
}

export const useRocketStore = defineStore('rockets', () => {
  const rockets = ref<Rocket[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const searchQuery = ref('')
  const activeFilters = ref<RocketFilter[]>([])
  const sortBy = ref<RocketSort>('name')

  // Locally added rockets get negative IDs so they never collide with API IDs
  let nextLocalId = -1

  const filteredRockets = computed(() => {
    const q = searchQuery.value.trim().toLowerCase()
    const matchesSearch = (r: Rocket) => !q ||
      r.name.toLowerCase().includes(q) ||
      (r.description?.toLowerCase().includes(q) ?? false) ||
      (r.countryCode?.toLowerCase().includes(q) ?? false)

    return rockets.value
      .filter(r => matchesSearch(r) && activeFilters.value.every(f => FILTER_PREDICATES[f](r)))
      .sort(SORT_COMPARATORS[sortBy.value])
  })

  const hasActiveFilters = computed(() => !!searchQuery.value.trim() || activeFilters.value.length > 0)

  const stats = computed(() => {
    const years = rockets.value
      .map(r => toTime(r.maidenFlight))
      .filter((t): t is number => t !== null)
      .map(t => new Date(t).getUTCFullYear())

    return {
      total: rockets.value.length,
      local: rockets.value.filter(r => r.isLocal).length,
      firstYear: years.length ? Math.min(...years) : null,
    }
  })

  async function loadRockets() {
    loading.value = true
    error.value = null
    try {
      const rawList = await fetchRockets()
      const mapped = rawList.map(mapRocketRaw)
      // keep locally added rockets
      const localRockets = rockets.value.filter(r => r.isLocal)
      rockets.value = [...mapped, ...localRockets]
    } catch (e) {
      error.value = getErrorMessage(e)
    } finally {
      loading.value = false
    }
  }

  function addRocket(rocket: NewRocket) {
    rockets.value.push({
      ...rocket,
      id: nextLocalId--,
      isLocal: true,
    })
  }

  function getRocketById(id: number): Rocket | undefined {
    return rockets.value.find(r => r.id === id)
  }

  function resetFilters() {
    searchQuery.value = ''
    activeFilters.value = []
  }

  return {
    rockets,
    loading,
    error,
    searchQuery,
    activeFilters,
    sortBy,
    filteredRockets,
    hasActiveFilters,
    stats,
    loadRockets,
    addRocket,
    getRocketById,
    resetFilters,
  }
})

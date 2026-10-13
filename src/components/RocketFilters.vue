<template>
  <div class="mb-6">
    <v-row dense>
      <v-col
        cols="12"
        sm="8"
        md="6"
      >
        <v-text-field
          v-model="searchInput"
          prepend-inner-icon="mdi-magnify"
          label="Search rockets"
          placeholder="Name, description, or country"
          variant="outlined"
          density="comfortable"
          clearable
          hide-details
        />
      </v-col>
      <v-col
        cols="12"
        sm="4"
        md="3"
      >
        <v-select
          v-model="sortBy"
          :items="SORT_OPTIONS"
          label="Sort by"
          variant="outlined"
          density="comfortable"
          hide-details
        />
      </v-col>
    </v-row>

    <div class="d-flex align-center flex-wrap ga-2 mt-3">
      <v-chip-group
        v-model="activeFilters"
        multiple
        column
        selected-class="bg-primary"
      >
        <v-chip
          v-for="filter in FILTER_OPTIONS"
          :key="filter.value"
          :value="filter.value"
          variant="outlined"
          size="small"
          label
        >
          {{ filter.title }}
        </v-chip>
      </v-chip-group>

      <v-spacer />

      <span
        v-if="rockets.length"
        class="tabular-nums text-body-2 text-medium-emphasis"
      >
        {{ filteredRockets.length }}/{{ rockets.length }}
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRocketStore } from '@/stores/rocketStore'
import { useDebounce } from '@/composables/useDebounce'
import type { RocketFilter, RocketSort } from '@/types/rocket'

const SORT_OPTIONS: { title: string, value: RocketSort }[] = [
  { title: 'Name (A–Z)', value: 'name' },
  { title: 'First flight (oldest)', value: 'first-flight-asc' },
  { title: 'First flight (newest)', value: 'first-flight-desc' },
  { title: 'Cost (lowest)', value: 'cost-asc' },
  { title: 'Cost (highest)', value: 'cost-desc' },
]

const FILTER_OPTIONS: { title: string, value: RocketFilter }[] = [
  { title: 'Has image', value: 'has-image' },
  { title: 'Has launch cost', value: 'has-cost' },
  { title: 'Locally added', value: 'local' },
]

const store = useRocketStore()
const { searchQuery, activeFilters, sortBy, filteredRockets, rockets } = storeToRefs(store)

const searchInput = ref<string | null>(searchQuery.value)
const debouncedSearch = useDebounce(searchInput, 300)

watch(debouncedSearch, value => {
  searchQuery.value = value ?? ''
})

// Keep the input in sync when the query is reset from elsewhere (e.g. "Clear filters")
watch(searchQuery, value => {
  if (value !== (searchInput.value ?? '')) searchInput.value = value
})
</script>

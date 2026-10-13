<template>
  <v-container
    class="pa-4 pa-md-8"
    max-width="1400"
  >
    <RocketListHeader />

    <RocketFilters />

    <v-row v-if="store.loading">
      <v-col
        v-for="n in SKELETON_COUNT"
        :key="n"
        v-bind="GRID_COLS"
        class="d-flex"
      >
        <RocketCardSkeleton />
      </v-col>
    </v-row>

    <ErrorState
      v-else-if="store.error"
      title="Failed to load rockets"
      :message="store.error"
      @retry="store.loadRockets"
    />

    <template v-else>
      <v-row v-if="store.filteredRockets.length">
        <v-col
          v-for="rocket in store.filteredRockets"
          :key="rocket.id"
          v-bind="GRID_COLS"
          class="d-flex"
        >
          <RocketCard :rocket="rocket" />
        </v-col>
      </v-row>

      <!-- Empty State -->
      <div
        v-else
        class="border py-12 px-6 text-center"
      >
        <p class="text-body-1 mb-1">
          Nothing matches that.
        </p>
        <p class="text-body-2 text-medium-emphasis mb-4">
          Try a different search or loosen the filters.
        </p>
        <v-btn
          v-if="store.hasActiveFilters"
          variant="outlined"
          @click="store.resetFilters"
        >
          Clear filters
        </v-btn>
      </div>
    </template>
  </v-container>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { useRocketStore } from '@/stores/rocketStore'
import RocketListHeader from '@/components/RocketListHeader.vue'
import RocketFilters from '@/components/RocketFilters.vue'
import RocketCard from '@/components/RocketCard.vue'
import RocketCardSkeleton from '@/components/RocketCardSkeleton.vue'
import ErrorState from '@/components/ErrorState.vue'

const GRID_COLS = { cols: 12, sm: 6, md: 4, lg: 3 }
const SKELETON_COUNT = 8

const store = useRocketStore()

onMounted(() => {
  if (store.rockets.length === 0) {
    store.loadRockets()
  }
})
</script>

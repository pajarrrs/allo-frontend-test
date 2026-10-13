<template>
  <header class="d-flex flex-wrap align-end justify-space-between ga-4 pb-6 mb-6 border-b">
    <div>
      <h1 class="font-weight-bold text-h4 text-md-h3">
        SpaceX rockets
      </h1>
      <p
        v-if="stats.total"
        class="tabular-nums text-body-2 text-medium-emphasis mt-2"
      >
        {{ stats.total }} vehicles
        <template v-if="stats.firstYear">
          · first flight {{ stats.firstYear }}
        </template>
        <template v-if="stats.local">
          · {{ stats.local }} added locally
        </template>
      </p>
    </div>

    <AddRocketDialog />
  </header>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useRocketStore } from '@/stores/rocketStore'
import AddRocketDialog from '@/components/AddRocketDialog.vue'

const { stats } = storeToRefs(useRocketStore())
</script>

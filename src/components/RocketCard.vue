<template>
  <v-card
    class="rocket-card d-flex flex-column border"
    width="100%"
    flat
    :to="`/rockets/${rocket.id}`"
  >
    <RocketImage
      :src="rocket.imageUrl"
      :alt="rocket.name"
    >
      <span
        v-if="rocket.isLocal"
        class="rocket-card__tag label-caption"
      >
        Local
      </span>
    </RocketImage>

    <div class="pa-4 flex-grow-1">
      <h2 class="font-weight-bold text-h6 mb-1">
        {{ rocket.name }}
      </h2>
      <p class="text-body-2 text-medium-emphasis rocket-card__description">
        {{ rocket.description || 'No description available.' }}
      </p>
    </div>

    <dl class="rocket-card__specs border-t">
      <div
        v-for="spec in specs"
        :key="spec.label"
        class="pa-3"
      >
        <dt class="label-caption">
          {{ spec.label }}
        </dt>
        <dd class="tabular-nums text-body-2">
          {{ spec.value ?? '—' }}
        </dd>
      </div>
    </dl>
  </v-card>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { Rocket } from '@/types/rocket'
import { formatCompactCurrency, formatYear } from '@/utils/format'
import RocketImage from '@/components/RocketImage.vue'

const props = defineProps<{
  rocket: Rocket
}>()

const specs = computed(() => [
  { label: 'Country', value: props.rocket.countryCode },
  { label: 'Debut', value: formatYear(props.rocket.maidenFlight) },
  { label: 'Cost', value: formatCompactCurrency(props.rocket.launchCost) },
])
</script>

<style scoped>
.rocket-card {
  transition: border-color 0.15s ease;
}
.rocket-card:hover {
  border-color: rgba(var(--v-theme-on-surface), 0.5) !important;
}
.rocket-card__tag {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 2px 8px;
  background: rgb(var(--v-theme-success));
  color: rgb(var(--v-theme-background));
}
.rocket-card__description {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.rocket-card__specs {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}
.rocket-card__specs > div + div {
  border-left: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
}
</style>

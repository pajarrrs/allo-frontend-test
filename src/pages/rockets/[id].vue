<template>
  <v-container
    class="pa-4 pa-md-8"
    max-width="1100"
  >
    <v-btn
      variant="text"
      prepend-icon="mdi-arrow-left"
      class="mb-6 ml-n3"
      to="/"
    >
      All rockets
    </v-btn>

    <LoadingState
      v-if="loading"
      message="Loading rocket..."
    />

    <ErrorState
      v-else-if="error"
      title="Couldn't load this rocket"
      :message="error"
      @retry="loadDetail"
    />

    <div
      v-else-if="notFound"
      class="border py-12 px-6 text-center"
    >
      <p class="text-body-1 mb-1">
        Rocket not found.
      </p>
      <p class="text-body-2 text-medium-emphasis">
        It doesn't exist, or it was added locally and the page has since been reloaded.
      </p>
    </div>

    <v-row v-else-if="rocket">
      <v-col
        cols="12"
        md="6"
      >
        <div class="border">
          <RocketImage
            :src="rocket.imageUrl"
            :alt="rocket.name"
            :height="460"
            :icon-size="48"
          />
        </div>
      </v-col>

      <v-col
        cols="12"
        md="6"
        class="pl-md-8"
      >
        <span
          v-if="rocket.isLocal"
          class="label-caption text-success"
        >
          Added locally
        </span>
        <h1 class="font-weight-bold text-h4 text-md-h3 mb-4">
          {{ rocket.name }}
        </h1>

        <p class="text-body-1 text-medium-emphasis mb-8">
          {{ rocket.description || 'No description available.' }}
        </p>

        <dl class="border-b">
          <div
            v-for="detail in details"
            :key="detail.label"
            class="d-flex justify-space-between align-baseline ga-4 py-3 border-t"
          >
            <dt class="label-caption">
              {{ detail.label }}
            </dt>
            <dd class="tabular-nums text-body-1 text-right">
              {{ detail.value }}
            </dd>
          </div>
        </dl>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useRocketStore } from '@/stores/rocketStore'
import { fetchRocketById, getErrorMessage } from '@/services/rocketApi'
import { mapRocketRaw } from '@/types/rocket'
import type { Rocket } from '@/types/rocket'
import { formatCurrency, formatDate, formatText } from '@/utils/format'
import RocketImage from '@/components/RocketImage.vue'
import LoadingState from '@/components/LoadingState.vue'
import ErrorState from '@/components/ErrorState.vue'

const route = useRoute('/rockets/[id]')
const store = useRocketStore()

const rocket = ref<Rocket | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const notFound = ref(false)

const details = computed(() => [
  { label: 'Cost per launch', value: formatCurrency(rocket.value?.launchCost ?? null) },
  { label: 'Country', value: formatText(rocket.value?.countryCode ?? null) },
  { label: 'First flight', value: formatDate(rocket.value?.maidenFlight ?? null) },
])

onMounted(() => {
  loadDetail()
})

async function loadDetail() {
  error.value = null
  notFound.value = false

  const id = Number(route.params.id)
  if (!Number.isInteger(id)) {
    notFound.value = true
    return
  }

  // Check store first (covers locally added rockets)
  const cached = store.getRocketById(id)
  if (cached) {
    rocket.value = cached
    return
  }

  // Local rockets (negative IDs) only live in memory and are gone after a refresh
  if (id < 0) {
    notFound.value = true
    return
  }

  loading.value = true
  try {
    const raw = await fetchRocketById(id)
    if (raw) {
      rocket.value = mapRocketRaw(raw)
    } else {
      notFound.value = true
    }
  } catch (e) {
    error.value = getErrorMessage(e)
  } finally {
    loading.value = false
  }
}
</script>

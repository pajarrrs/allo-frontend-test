<template>
  <v-img
    v-if="src"
    :src="src"
    :alt="alt"
    :height="height"
    cover
    class="bg-surface-bright"
  >
    <template #placeholder>
      <div class="d-flex align-center justify-center fill-height">
        <v-progress-circular
          indeterminate
          color="secondary"
          size="28"
          width="2"
        />
      </div>
    </template>
    <template #error>
      <RocketImageFallback :icon-size="iconSize" />
    </template>
    <div
      v-if="$slots.default"
      class="rocket-image__overlay"
    >
      <slot />
    </div>
  </v-img>
  <div
    v-else
    class="position-relative"
    :style="{ height: `${height}px` }"
  >
    <RocketImageFallback :icon-size="iconSize" />
    <div
      v-if="$slots.default"
      class="rocket-image__overlay"
    >
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import RocketImageFallback from '@/components/RocketImageFallback.vue'

withDefaults(defineProps<{
  src: string | null
  alt: string
  height?: number
  iconSize?: number
}>(), {
  height: 220,
  iconSize: 64,
})

defineSlots<{
  /** Content rendered on top of the image, e.g. a title */
  default?: () => unknown
}>()
</script>

<style scoped>
.rocket-image__overlay {
  position: absolute;
  inset: 0;
}
</style>

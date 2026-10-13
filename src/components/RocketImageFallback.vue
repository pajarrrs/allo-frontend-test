<template>
  <div class="d-flex flex-column align-center justify-center ga-2 fill-height bg-surface-bright">
    <v-icon
      :size="iconSize"
      color="secondary"
    >
      mdi-image-off-outline
    </v-icon>
    <span class="label-caption">No image</span>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  iconSize: number
}>()
</script>

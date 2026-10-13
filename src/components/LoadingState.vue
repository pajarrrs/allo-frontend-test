<template>
  <div class="d-flex flex-column align-center justify-center py-16">
    <v-progress-circular
      indeterminate
      size="64"
      width="5"
      color="primary"
    />
    <p class="text-body-1 text-medium-emphasis mt-4">
      {{ message }}
    </p>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  message: string
}>()
</script>

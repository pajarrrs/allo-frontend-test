<template>
  <v-alert
    type="error"
    variant="outlined"
    class="mb-6"
  >
    <div class="d-flex align-center justify-space-between flex-wrap ga-4">
      <div>
        <div class="text-subtitle-1 font-weight-bold">
          {{ title }}
        </div>
        <div class="text-body-2">
          {{ message }}
        </div>
      </div>
      <v-btn
        variant="outlined"
        color="error"
        prepend-icon="mdi-refresh"
        @click="$emit('retry')"
      >
        Retry
      </v-btn>
    </div>
  </v-alert>
</template>

<script lang="ts" setup>
defineProps<{
  title: string
  message: string
}>()

defineEmits<{
  retry: []
}>()
</script>

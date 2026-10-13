<template>
  <v-dialog
    v-model="dialog"
    max-width="600"
    persistent
  >
    <template #activator="{ props: activatorProps }">
      <v-btn
        v-bind="activatorProps"
        color="primary"
        prepend-icon="mdi-plus"
        variant="flat"
      >
        Add rocket
      </v-btn>
    </template>

    <v-card class="border">
      <v-card-title class="font-weight-bold text-h5 pa-5 pb-1">
        New rocket
      </v-card-title>

      <v-card-text>
        <v-form
          ref="formRef"
          @submit.prevent="submit"
        >
          <v-text-field
            v-model="form.name"
            label="Rocket Name *"
            :rules="[rules.required]"
            variant="outlined"
            class="mb-2"
          />

          <v-textarea
            v-model="form.description"
            label="Description"
            variant="outlined"
            rows="3"
            class="mb-2"
          />

          <v-text-field
            v-model="form.imageUrl"
            label="Image URL"
            placeholder="https://..."
            :rules="[rules.url]"
            variant="outlined"
            class="mb-2"
          />

          <v-text-field
            v-model="form.launchCost"
            label="Cost per Launch (USD)"
            type="number"
            min="0"
            prefix="$"
            :rules="[rules.positiveNumber]"
            variant="outlined"
            class="mb-2"
          />

          <v-text-field
            v-model="form.countryCode"
            label="Country Code"
            placeholder="USA"
            maxlength="3"
            :rules="[rules.countryCode]"
            variant="outlined"
            class="mb-2"
          />

          <v-text-field
            v-model="form.maidenFlight"
            label="First Flight"
            type="date"
            variant="outlined"
          />

          <!-- Lets Enter submit the form -->
          <button
            type="submit"
            hidden
          />
        </v-form>
      </v-card-text>

      <v-card-actions class="px-5 pb-5">
        <v-spacer />
        <v-btn
          variant="text"
          @click="close"
        >
          Cancel
        </v-btn>
        <v-btn
          variant="flat"
          color="primary"
          @click="submit"
        >
          Add rocket
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import type { VForm } from 'vuetify/components'
import { useRocketStore } from '@/stores/rocketStore'

const store = useRocketStore()
const dialog = ref(false)
const formRef = ref<VForm>()

const rules = {
  required: (v: string) => !!v?.trim() || 'Required',
  url: (v: string) => !v || /^https?:\/\/\S+$/.test(v.trim()) || 'Must be a valid http(s) URL',
  positiveNumber: (v: string) => !v || Number(v) >= 0 || 'Must be a positive number',
  countryCode: (v: string) => !v || /^[A-Za-z]{2,3}$/.test(v.trim()) || 'Use a 2–3 letter code',
}

const defaultForm = () => ({
  name: '',
  description: '',
  imageUrl: '',
  launchCost: '',
  countryCode: '',
  maidenFlight: '',
})

const form = reactive(defaultForm())

const toNullable = (value: string) => value.trim() || null

async function submit() {
  const { valid } = await formRef.value!.validate()
  if (!valid) return

  store.addRocket({
    name: form.name.trim(),
    description: toNullable(form.description),
    imageUrl: toNullable(form.imageUrl),
    launchCost: toNullable(String(form.launchCost)),
    countryCode: toNullable(form.countryCode)?.toUpperCase() ?? null,
    maidenFlight: toNullable(form.maidenFlight),
  })
  close()
}

function close() {
  dialog.value = false
  Object.assign(form, defaultForm())
  formRef.value?.resetValidation()
}
</script>

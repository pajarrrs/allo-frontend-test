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
          validate-on="input lazy"
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

  <v-snackbar
    v-model="snackbar"
    location="top"
    :timeout="4000"
    color="surface"
    elevation="8"
    rounded="sm"
    class="rocket-snackbar"
  >
    <div class="d-flex align-center ga-3 py-1">
      <div class="snackbar-badge d-flex align-center justify-center">
        <v-icon
          icon="mdi-check"
          color="success"
          size="18"
        />
      </div>
      <div class="pr-2">
        <div class="text-body-2 font-weight-bold text-high-emphasis">
          Rocket added successfully
        </div>
        <div class="text-caption text-medium-emphasis">
          <span class="text-high-emphasis font-weight-medium">"{{ addedRocketName }}"</span> has been added to the list.
        </div>
      </div>
    </div>

    <template #actions>
      <v-btn
        variant="text"
        icon="mdi-close"
        size="small"
        density="compact"
        class="text-medium-emphasis"
        @click="snackbar = false"
      />
    </template>
  </v-snackbar>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, nextTick } from 'vue'
import type { VForm } from 'vuetify/components'
import { useRocketStore } from '@/stores/rocketStore'

const store = useRocketStore()
const dialog = ref(false)
const snackbar = ref(false)
const addedRocketName = ref('')
const formRef = ref<VForm>()

const rules = {
  required: (v: string) => (!!v && !!v.trim()) || 'Rocket Name is required',
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

watch(dialog, (isOpen) => {
  if (!isOpen) {
    setTimeout(() => {
      Object.assign(form, defaultForm())
      nextTick(() => {
        formRef.value?.resetValidation()
      })
    }, 250)
  }
})

async function submit() {
  const result = await formRef.value?.validate()
  if (!result?.valid) return

  const rocketName = form.name.trim()

  store.addRocket({
    name: rocketName,
    description: toNullable(form.description),
    imageUrl: toNullable(form.imageUrl),
    launchCost: toNullable(String(form.launchCost)),
    countryCode: toNullable(form.countryCode)?.toUpperCase() ?? null,
    maidenFlight: toNullable(form.maidenFlight),
  })

  addedRocketName.value = rocketName
  snackbar.value = true
  close()
}

function close() {
  dialog.value = false
}
</script>

<style scoped>
.snackbar-badge {
  width: 28px;
  height: 28px;
  border-radius: 4px;
  background: rgba(155, 211, 143, 0.12);
  border: 1px solid rgba(155, 211, 143, 0.35);
  flex-shrink: 0;
}
</style>

/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import '@/styles/main.css'

// Composables
import { createVuetify } from 'vuetify'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'mission',
    themes: {
      mission: {
        dark: true,
        colors: {
          'background': '#0c0c0d',
          'surface': '#141416',
          'surface-bright': '#1c1c1f',
          'primary': '#ededea',
          'on-primary': '#0c0c0d',
          'secondary': '#8a8a85',
          'error': '#ff6a5c',
          'success': '#9bd38f',
        },
      },
    },
  },
  defaults: {
    VBtn: { rounded: 'sm' },
    VChip: { rounded: 'sm' },
    VCard: { rounded: 'sm' },
    VTextField: { rounded: 'sm' },
    VSelect: { rounded: 'sm' },
  },
})

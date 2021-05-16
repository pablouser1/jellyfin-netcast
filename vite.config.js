import { defineConfig } from 'vite'
import legacy from '@vitejs/plugin-legacy'
import preact from '@preact/preset-vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    legacy({
      additionalLegacyPolyfills: [
        'whatwg-fetch'
      ]
    }),
    preact()
  ]
})

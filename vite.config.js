import { defineConfig } from 'vite'
import legacy from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    legacy({
      additionalLegacyPolyfills: [
        'whatwg-fetch'
      ]
    }),
    vue()
  ]
})

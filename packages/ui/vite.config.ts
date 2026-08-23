import ui from '@nuxt/ui/vite'
import vue from '@vitejs/plugin-vue'
import icons from 'unplugin-icons/vite'
import { defineConfig } from 'vite'
import router from 'vue-router/vite'

export default defineConfig({
  plugins: [
    router(),
    vue(),
    ui({
      autoImport: {
        dts: false, // Can't be enabled when building a package.
      },
      components: {
        dts: false, // Can't be enabled when building a package.
      },
    }),
    icons({
      autoInstall: true,
    }),
  ],
  optimizeDeps: {
    include: [
      'vue',
      'pinia',
      '@pinia/colada',
    ],
  },
})

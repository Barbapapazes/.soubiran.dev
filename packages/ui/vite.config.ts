import ui from '@nuxt/ui/vite'
import vue from '@vitejs/plugin-vue'
import icons from 'unplugin-icons/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    vue(),
    ui({
      autoImport: {
        dts: false,
      },
      components: {
        dts: false,
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

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
        dts: 'src/auto-imports.d.ts',
      },
      components: {
        dts: 'src/components.d.ts',
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

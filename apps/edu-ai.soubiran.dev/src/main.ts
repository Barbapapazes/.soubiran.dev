import ui from '@nuxt/ui/vue-plugin'
import { PiniaColada } from '@pinia/colada'
import { createPinia } from 'pinia'
import { ViteSSG } from 'vite-ssg'
import { routes } from 'vue-router/auto-routes'
import App from './App.vue'

import './style.css'

export const createApp = ViteSSG(
  App,
  {
    routes,
  },
  ({ app }) => {
    app.use(ui)
    app.use(createPinia())
    app.use(PiniaColada)
  },
)

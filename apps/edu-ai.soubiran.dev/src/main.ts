import ui from '@nuxt/ui/vue-plugin'
import { PiniaColada } from '@pinia/colada'
import { createPinia } from 'pinia'
import { ViteSSG } from 'vite-ssg'
import { routes } from 'vue-router/auto-routes'
import App from './App.vue'

import 'markdown-it-github-alerts/styles/github-colors-light.css'
import 'markdown-it-github-alerts/styles/github-colors-dark-class.css'
import 'markdown-it-github-alerts/styles/github-base.css'
import '@soubiran/ui/styles.css'
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

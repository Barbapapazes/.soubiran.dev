import ui from '@nuxt/ui/vue-plugin'
import { PiniaColada } from '@pinia/colada'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import App from './App.vue'

import './main.css'
import './style.css'

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const app = createApp(App)

app.use(router)
  .use(ui)
  .use(createPinia())
  .use(PiniaColada)

app.mount('#app')

export default app

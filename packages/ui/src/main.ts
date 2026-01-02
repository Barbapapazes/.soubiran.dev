import ui from '@nuxt/ui/vue-plugin'
import { PiniaColada } from '@pinia/colada'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'

import './styles.css'

const app = createApp(App)

app.use(ui)
app.use(createPinia())
app.use(PiniaColada)

app.mount('#app')

export default app

import type { LocaleMessages } from './type'
import { defineLocale } from '@nuxt/ui/composables/defineLocale'

export default defineLocale<LocaleMessages>({
  name: 'English',
  code: 'en',
  messages: {},
})

import type { NuxtUIOptions } from '@nuxt/ui/vite'

export default {
  pageHeader: {
    slots: {
      root: 'py-0 border-b-0',
      title: 'sm:text-xl text-xl font-bold text-highlighted',
    },
  },
  pageBody: {
    base: 'mt-6',
  },
} satisfies NuxtUIOptions['ui']

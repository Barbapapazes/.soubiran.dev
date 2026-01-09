<script lang="ts">
import type { Locale } from '@nuxt/ui'
import type { LocaleMessages } from '../locale/type'
import { provide, toRef } from 'vue'
import { localeContextInjectionKey } from '../composables/useLocale'

export interface AppProps {
  locale?: Locale<LocaleMessages>
}
</script>

<script lang="ts" setup>
const props = defineProps<AppProps>()

const locale = toRef(() => props.locale)
provide(localeContextInjectionKey, locale)
</script>

<template>
  <slot />
</template>

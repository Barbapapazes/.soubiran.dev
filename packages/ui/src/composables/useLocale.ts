import type { Locale } from '@nuxt/ui'
import type { InjectionKey, Ref } from 'vue'
import type { LocaleMessages } from '../locale/type'
import { buildLocaleContext } from '@nuxt/ui/utils/locale'
import { computed, inject } from 'vue'
import en from '../locale/en'

export const localeContextInjectionKey: InjectionKey<Ref<Locale<LocaleMessages> | undefined>> = Symbol.for('soubiran-ui.locale-context')

export function useLocale(localeOverrides?: Ref<Locale<LocaleMessages> | undefined>) {
  const locale = localeOverrides || inject(localeContextInjectionKey)

  return buildLocaleContext<LocaleMessages>(computed(() => locale?.value || en))
}

import type { Locale } from '@nuxt/ui'
import type { InjectionKey, Ref } from 'vue'
import type { LocaleMessages } from '../locale/type'
import { buildLocaleContext } from '@nuxt/ui/utils/locale'
import { createSharedComposable } from '@vueuse/core'
import { computed, inject, toRef } from 'vue'
import en from '../locale/en'

export const localeContextInjectionKey: InjectionKey<Ref<Locale<unknown> | undefined>> = Symbol.for('soubiran-ui.locale-context')

function _useLocale(localeOverrides?: Ref<Locale<LocaleMessages> | undefined>) {
  const locale = localeOverrides || toRef(inject<Locale<LocaleMessages>>(localeContextInjectionKey, en))

  return buildLocaleContext<LocaleMessages>(computed(() => locale.value || en))
}

export const useLocale = createSharedComposable(_useLocale)

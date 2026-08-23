<script lang="ts">
import type { LocaleCode } from '../locale/type'
import type { DiscussionsSectionProps } from './Discussions/DiscussionsSection.vue'
import { extendLocale } from '@nuxt/ui/composables/defineLocale'
import { computed, provide, toRef } from 'vue'
import { provideCommentsContext } from '../composables/comments/context'
import { useCommentsBanner } from '../composables/comments/useCommentsBanner'
import { localeContextInjectionKey } from '../composables/useLocale'
import en from '../locale/en'
import fr from '../locale/fr'
import DiscussionsSection from './Discussions/DiscussionsSection.vue'

export interface CommentsProps {
  pageId: string
  locale?: LocaleCode
  class?: DiscussionsSectionProps['class']
  ui?: DiscussionsSectionProps['ui']
}
</script>

<script lang="ts" setup>
const props = withDefaults(defineProps<CommentsProps>(), {
  locale: 'en',
})

const resolvedLocale = computed(() => extendLocale(
  props.locale === 'fr' ? fr : en,
  { messages: {} },
))
provide(localeContextInjectionKey, resolvedLocale)

const banner = useCommentsBanner()

provideCommentsContext({
  pageId: toRef(() => props.pageId),
  locale: toRef(() => props.locale),
  banner,
})
</script>

<template>
  <DiscussionsSection
    :class="props.class"
    :ui="props.ui"
  />
</template>

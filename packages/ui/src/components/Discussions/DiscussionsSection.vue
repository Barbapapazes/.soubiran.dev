<script lang="ts">
import UAlert from '@nuxt/ui/components/Alert.vue'
import { useQuery } from '@pinia/colada'
import { AnimatePresence, Motion, useReducedMotion } from 'motion-v'
import { tv } from 'tailwind-variants'
import { computed } from 'vue'
import { getComments } from '../../api/comments.ts'
import { useCommentsContext } from '../../composables/comments/context.ts'
import { useLocale } from '../../composables/useLocale'
import { COMMENT_QUERY_KEYS } from '../../keys/comments.ts'
import CommentFormSection from '../Comments/CommentFormSection.vue'
import StateEmpty from '../State/StateEmpty.vue'
import StateError from '../State/StateError.vue'
import StatePending from '../State/StatePending.vue'
import DiscussionsList from './DiscussionsList.vue'
import DiscussionsSectionSubtitle from './DiscussionsSectionSubtitle.vue'
import DiscussionsSectionTitle from './DiscussionsSectionTitle.vue'

const discussionsSection = tv({
  slots: {
    base: '',
    alert: '',
    header: 'mb-6',
    content: 'mt-6',
  },
})

export interface DiscussionsSectionProps {
  class?: any
  ui?: Partial<typeof discussionsSection.slots>
}
export interface DiscussionsSectionEmits {}
export interface DiscussionsSectionSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<DiscussionsSectionProps>()
defineEmits<DiscussionsSectionEmits>()
defineSlots<DiscussionsSectionSlots>()

const { t } = useLocale()
const reducedMotion = useReducedMotion()

const { pageId, locale, banner: bannerController } = useCommentsContext()
const { banner, isActive, dismiss } = bannerController

const { data: comments, error: commentsError, isPending: isCommentsPending } = useQuery({
  key: COMMENT_QUERY_KEYS.byPageId(pageId.value, locale.value),
  query: () => getComments(pageId.value, locale.value).then(response => response.data),
  enabled: typeof window !== 'undefined',
})

const ui = computed(() => discussionsSection())
</script>

<template>
  <section id="comments">
    <div :class="ui.base({ class: [props.class, props.ui?.base] })">
      <div :class="ui.header({ class: props.ui?.header })">
        <DiscussionsSectionTitle />
        <DiscussionsSectionSubtitle
          :comments="comments ?? []"
        />
      </div>

      <AnimatePresence>
        <Motion
          v-if="banner && isActive"
          :initial="reducedMotion ? false : {
            height: 0,
            opacity: 0,
          }"
          :animate="{
            height: 'auto',
            opacity: 1,
            transition: {
              duration: reducedMotion ? 0 : 0.2,
              ease: 'easeOut',
            },
          }"
          :exit="reducedMotion ? undefined : {
            height: 0,
            opacity: 0,
          }"
        >
          <UAlert
            :title="banner.message"
            :class="ui.alert({ class: props.ui?.alert })"
            :color="banner.kind === 'error' ? 'error' : 'success'"
            variant="subtle"
            close
            :role="banner.kind === 'error' ? 'alert' : 'status'"
            @update:open="dismiss"
          />
        </Motion>
      </AnimatePresence>

      <!--
        Spacer to preserve layout during the Alert height animation.
        Adding margin to the Alert breaks the smooth transition because
        the animated element collapses abruptly. We render an empty
        div with `mt-6` while the Alert is active to keep the animation smooth.
      -->
      <div v-if="banner && isActive" class="mt-6" />

      <StatePending v-if="isCommentsPending" />
      <StateError v-else-if="commentsError" />

      <StateEmpty
        v-else-if="!(comments ?? []).length"
        :text="t('discussions.DiscussionsSection.empty')"
      />

      <DiscussionsList
        v-else
        :comments="comments ?? []"
      />

      <CommentFormSection
        class="mt-12"
      />
    </div>
  </section>
</template>

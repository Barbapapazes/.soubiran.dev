<script lang="ts">
import UAlert from '@nuxt/ui/components/Alert.vue'
import { useQuery } from '@pinia/colada'
import { AnimatePresence, Motion } from 'motion-v'
import { tv } from 'tailwind-variants'
import { computed, nextTick } from 'vue'
import { useDiscussionsAlert } from '../../composables/useDiscussionsAlert'
import { useLocale } from '../../composables/useLocale'
import { commentsByPageIdQuery } from '../../queries/comments'
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
  id: string
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
const { state: commentsState } = useQuery(commentsByPageIdQuery, () => ({ id: props.id }))

const { isActive, message, color } = useDiscussionsAlert()
function onAnimationComplete() {
  nextTick(() => {
    const commentsElement = document.getElementById('comments')
    if (commentsElement) {
      window.scrollTo({
        top: commentsElement.offsetTop,
        behavior: 'smooth',
      })
    }
  })
}

const ui = computed(() => discussionsSection())
</script>

<template>
  <section id="comments">
    <div :class="ui.base({ class: [props.class, props.ui?.header] })">
      <div :class="ui.header({ class: props.ui?.header })">
        <DiscussionsSectionTitle />
        <DiscussionsSectionSubtitle
          :id="props.id"
        />
      </div>

      <AnimatePresence>
        <Motion
          v-if="isActive"
          :initial="{
            height: 0,
            opacity: 0,
            filter: 'blur(4px)',
            translateY: 2,
          }"
          :animate="{
            height: 'auto',
            opacity: 1,
            filter: 'blur(0)',
            translateY: 0,
            transition: {
              duration: 0.3,
              ease: 'easeOut',
            },
          }"
          :exit="{
            height: 0,
            opacity: 0,
            filter: 'blur(4px)',
            translateY: 2,
          }"
          @animation-complete="onAnimationComplete"
        >
          <UAlert
            :title="message"
            :class="ui.alert({ class: props.ui?.alert })"
            :color="color"
            variant="subtle"
          />
        </Motion>
      </AnimatePresence>

      <!--
        Spacer to preserve layout during the Alert height animation.
        Adding margin to the Alert breaks the smooth transition because
        the animated element collapses abruptly. We render an empty
        div with `mt-6` while the Alert is active to keep the animation smooth.
      -->
      <div v-if="isActive" class="mt-6" />

      <StatePending v-if="commentsState.status === 'pending'" />
      <StateError v-else-if="commentsState.status === 'error'" />

      <StateEmpty
        v-else-if="!commentsState.data?.data.length"
        :text="t('discussions.DiscussionsSection.empty')"
      />

      <DiscussionsList
        v-else
        :id="props.id"
      />

      <CommentFormSection
        :id="props.id"
        class="mt-12"
      />
    </div>
  </section>
</template>

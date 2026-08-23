<script lang="ts">
import type { Comment } from '../../types/comment'
import { tv } from 'tailwind-variants'
import { computed } from 'vue'
import { useLocale } from '../../composables/useLocale'
import Subtitle from '../Subtitle.vue'

const discussionsSectionSubtitle = tv({
  base: '',
})

export interface DiscussionsSectionSubtitleProps {
  comments: Comment[]
  class?: any
}
export interface DiscussionsSectionSubtitleEmits {}
export interface DiscussionsSectionSubtitleSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<DiscussionsSectionSubtitleProps>()
defineEmits<DiscussionsSectionSubtitleEmits>()
defineSlots<DiscussionsSectionSubtitleSlots>()

const { t } = useLocale()
const commentsSubtitle = computed(() => {
  const count = props.comments.length

  if (count !== 1) {
    return t('discussions.DiscussionsSectionSubtitle.comments.plural', { count })
  }

  return t('discussions.DiscussionsSectionSubtitle.comments.singular', { count })
})
const repliesSubtitle = computed(() => {
  const count = props.comments.reduce((acc: number, comment: Comment) => acc + (comment.replies?.length ?? 0), 0)

  if (count !== 1) {
    return t('discussions.DiscussionsSectionSubtitle.replies.plural', { count })
  }

  return t('discussions.DiscussionsSectionSubtitle.replies.singular', { count })
})

const ui = computed(() => discussionsSectionSubtitle({ class: props.class }))
</script>

<template>
  <Subtitle :class="ui">
    {{ commentsSubtitle }} · {{ repliesSubtitle }}
  </Subtitle>
</template>

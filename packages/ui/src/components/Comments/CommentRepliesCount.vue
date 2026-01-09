<script lang="ts">
import type { Comment } from '../../types/comment'
import { tv } from 'tailwind-variants'
import { computed } from 'vue'
import { useLocale } from '../../composables/useLocale'

// TODO: update styles with the new design system
const commentRepliesCount = tv({
  base: 'text-xs text-neutral-500 dark:text-neutral-400',
})

export interface CommentRepliesCountProps {
  comment: Comment
  class?: any
}
export interface CommentRepliesCountEmits {}
export interface CommentRepliesCountSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<CommentRepliesCountProps>()
defineEmits<CommentRepliesCountEmits>()
defineSlots<CommentRepliesCountSlots>()

const { t } = useLocale()

const replies = computed(() => {
  if (props.comment.replies.length > 1) {
    return t('comments.CommentRepliesCount.replies').replace('{count}', props.comment.replies.length.toString())
  }

  return t('comments.CommentRepliesCount.reply').replace('{count}', props.comment.replies.length.toString())
})

const ui = computed(() => commentRepliesCount({ class: props.class }))
</script>

<template>
  <span v-if="props.comment.replies.length" :class="ui">
    {{ replies }}
  </span>
</template>

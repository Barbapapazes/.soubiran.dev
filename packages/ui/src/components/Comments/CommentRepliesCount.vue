<script lang="ts">
import type { Comment } from '../../types/comment'
import { tv } from 'tailwind-variants'
import { computed } from 'vue'
import { useLocale } from '../../composables/useLocale'

const commentRepliesCount = tv({
  base: 'text-xs text-dimmed',
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
    return t('comments.CommentRepliesCount.replies', { count: props.comment.replies.length })
  }

  return t('comments.CommentRepliesCount.reply', { count: props.comment.replies.length })
})

const ui = computed(() => commentRepliesCount({ class: props.class }))
</script>

<template>
  <span v-if="props.comment.replies.length" :class="ui">
    {{ replies }}
  </span>
</template>

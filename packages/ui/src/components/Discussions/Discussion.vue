<script lang="ts">
import type { Comment } from '../../types/comment'
import { tv } from 'tailwind-variants'
import { computed } from 'vue'
import CommentVue from '../Comments/Comment.vue'
import DiscussionReply from './DiscussionReply.vue'

const discussion = tv({
  slots: {
    base: 'overflow-hidden border border-neutral-200 rounded-md dark:border-neutral-600',
    answers: 'bg-neutral-50 dark:bg-neutral-950',
    reply: 'p-2',
  },
})

export interface DiscussionProps {
  comment: Comment
  class?: any
  ui?: Partial<typeof discussion.slots>
}
export interface DiscussionEmits {}
export interface DiscussionSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<DiscussionProps>()
defineEmits<DiscussionEmits>()
defineSlots<DiscussionSlots>()

const ui = computed(() => discussion())
</script>

<template>
  <div :class="ui.base({ class: [props.class, props.ui?.base] })">
    <CommentVue :comment="comment" />

    <div
      v-if="comment.replies.length"
      :class="ui.answers({ class: props.ui?.answers })"
    >
      <CommentVue
        v-for="reply in comment.replies"
        :key="reply.id"
        :parent-comment="comment"
        :comment="reply"
      />
    </div>

    <div :class="ui.reply({ class: props.ui?.reply })">
      <DiscussionReply :parent-comment="comment" />
    </div>
  </div>
</template>

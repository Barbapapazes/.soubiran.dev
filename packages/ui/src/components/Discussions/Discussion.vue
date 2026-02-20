<script lang="ts">
import type { Comment } from '../../types/comment'
import { tv } from 'tailwind-variants'
import { computed } from 'vue'
import CommentVue from '../Comments/Comment.vue'
import DiscussionReply from './DiscussionReply.vue'

const discussion = tv({
  slots: {
    base: 'overflow-hidden border border-muted rounded-md',
    answers: 'bg-muted',
    reply: 'p-2',
  },
})

export interface DiscussionProps {
  id: string
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
    <CommentVue :id="props.id" :comment="comment" />

    <div
      v-if="comment.replies.length"
      :class="ui.answers({ class: props.ui?.answers })"
    >
      <CommentVue
        v-for="reply in comment.replies"
        :id="props.id"
        :key="reply.id"
        :parent-comment="comment"
        :comment="reply"
      />
    </div>

    <div :class="ui.reply({ class: props.ui?.reply })">
      <DiscussionReply :id="props.id" :parent-comment="comment" />
    </div>
  </div>
</template>

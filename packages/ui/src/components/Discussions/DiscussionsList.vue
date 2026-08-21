<script lang="ts">
import type { Comment } from '../../types/comment'
import { tv } from 'tailwind-variants'
import { computed } from 'vue'
import Discussion from './Discussion.vue'

const discussionsList = tv({
  slots: {
    base: 'space-y-8',
    discussion: '',
  },
})

export interface DiscussionsListProps {
  comments: Comment[]
  class?: any
  ui?: Partial<typeof discussionsList.slots>
}
export interface DiscussionsListEmits {}
export interface DiscussionsListSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<DiscussionsListProps>()
defineEmits<DiscussionsListEmits>()
defineSlots<DiscussionsListSlots>()

const ui = computed(() => discussionsList())
</script>

<template>
  <div :class="ui.base({ class: [props.class, props.ui?.base] })">
    <Discussion
      v-for="comment in props.comments"
      :key="comment.id"
      :comment="comment"
      :class="ui.discussion({ class: props.ui?.discussion })"
    />
  </div>
</template>

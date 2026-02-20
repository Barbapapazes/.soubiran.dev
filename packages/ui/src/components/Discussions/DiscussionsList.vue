<script lang="ts">
import { useQuery } from '@pinia/colada'
import { tv } from 'tailwind-variants'
import { computed } from 'vue'
import { commentsByPageIdQuery } from '../../queries/comments'
import Discussion from './Discussion.vue'

const discussionsList = tv({
  slots: {
    base: 'space-y-8',
    discussion: '',
  },
})

export interface DiscussionsListProps {
  id: string
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

const { data: comments } = useQuery(commentsByPageIdQuery, () => ({ id: props.id }))

const ui = computed(() => discussionsList())
</script>

<template>
  <div v-if="comments" :class="ui.base({ class: [props.class, props.ui?.base] })">
    <Discussion
      v-for="comment in comments.data"
      :id="props.id"
      :key="comment.id"
      :comment="comment"
      :class="ui.discussion({ class: props.ui?.discussion })"
    />
  </div>
</template>

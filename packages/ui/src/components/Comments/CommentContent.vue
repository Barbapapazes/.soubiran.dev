<script lang="ts">
import type { Comment } from '../../types/comment'
import { tv } from 'tailwind-variants'
import { computed, nextTick, ref, watch } from 'vue'

const commentContent = tv({
  base: '',
})

export interface CommentContentProps {
  parentComment?: Comment
  comment: Comment
  class?: any
}
export interface CommentContentEmits {
  success: [void]
}
export interface CommentContentSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<CommentContentProps>()
const emit = defineEmits<CommentContentEmits>()
defineSlots<CommentContentSlots>()

const editor = ref<typeof Editor | null>(null)

const viewEditor = defineModel<boolean>('viewEditor')
watch(viewEditor, (value) => {
  if (value) {
    nextTick(() => {
      editor.value?.focus()
    })
  }
})

function onSuccess() {
  emit('success')

  viewEditor.value = false
}

const ui = computed(() => commentContent({ class: props.class }))
</script>

<template>
  <CommentForm
    v-if="viewEditor"
    ref="editor"
    cancelable
    :comment="comment"
    :parent-comment="parentComment"
    :class="ui"
    @success="onSuccess"
    @cancel="viewEditor = false"
  />
  <!-- TODO: manage prose without-margin -->
  <Prose v-else without-margin class="text-sm">
    <div v-html="comment.content_html" />
  </Prose>
</template>

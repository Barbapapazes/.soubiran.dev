<script lang="ts">
import type { Comment } from '../../../types/comment'
import { tv } from 'tailwind-variants'
import { computed } from 'vue'
import { useLocale } from '../../../composables/useLocale'
import { useDeleteComment } from '../../../mutations/useDeleteComment'

const confirmDeleteCommentModal = tv({
  slots: {
    base: '',
  },
})

export interface ConfirmDeleteCommentModalProps {
  comment: Comment
  parentComment?: Comment
  class?: any
  ui?: Partial<typeof confirmDeleteCommentModal.slots>
}
export interface ConfirmDeleteCommentModalEmits {
  close: [void]
}
export interface ConfirmDeleteCommentModalSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<ConfirmDeleteCommentModalProps>()
const emit = defineEmits<ConfirmDeleteCommentModalEmits>()
defineSlots<ConfirmDeleteCommentModalSlots>()

const { t } = useLocale()

function onClose() {
  emit('close')
}

const { mutate: deleteComment } = useDeleteComment()
function onConfirm() {
  deleteComment({
    parentCommentId: props.parentComment?.id,
    commentId: props.comment.id,
  })

  emit('close')
}

const ui = computed(() => confirmDeleteCommentModal())
</script>

<template>
  <ConfirmModal
    :title="t('comments.CommentConfirmDelete.title')"
    :description="t('comments.CommentConfirmDelete.description')"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
    @close="onClose"
    @confirm="onConfirm"
  />
</template>

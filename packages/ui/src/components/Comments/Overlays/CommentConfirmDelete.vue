<script lang="ts">
import type { Comment } from '../../../types/comment'
import { useMutation, useQueryCache } from '@pinia/colada'
import { tv } from 'tailwind-variants'
import { computed, nextTick } from 'vue'
import { deleteComment } from '../../../api/comments'
import { useDiscussionsAlert } from '../../../composables/useDiscussionsAlert'
import { useLocale } from '../../../composables/useLocale'
import { COMMENT_QUERY_KEY } from '../../../queries/comments'
import { getCommentById } from '../../../utils/comments'
import ConfirmModal from '../../ConfirmModal.vue'

const confirmDeleteCommentModal = tv({
  slots: {
    base: '',
  },
})

export interface ConfirmDeleteCommentModalProps {
  id: string
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

const { show } = useDiscussionsAlert()
const queryCache = useQueryCache()
const { mutate, isLoading } = useMutation({
  mutation: ({ commentId }: { commentId: number, parentCommentId?: number }) => deleteComment(commentId),
  onSuccess: () => {
    show(t('comments.CommentConfirmDelete.successMessage'))
  },

  onError: () => {
    show(t('comments.CommentConfirmDelete.errorMessage'), 'error')
  },

  onSettled: async () => {
    await queryCache.invalidateQueries({ key: COMMENT_QUERY_KEY.byPageId(props.id) })

    emit('close')
  },
})

function onClose() {
  emit('close')
}

function onConfirm() {
  mutate({
    parentCommentId: props.parentComment?.id,
    commentId: props.comment.id,
  })
}

const ui = computed(() => confirmDeleteCommentModal())
</script>

<template>
  <ConfirmModal
    :title="t('comments.CommentConfirmDelete.title')"
    :description="t('comments.CommentConfirmDelete.description')"
    :loading="isLoading"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
    @close="onClose"
    @confirm="onConfirm"
  />
</template>

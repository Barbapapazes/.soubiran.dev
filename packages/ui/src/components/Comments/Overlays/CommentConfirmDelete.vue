<script lang="ts">
import type { Comment } from '../../../types/comment'
import { useMutation, useQueryCache } from '@pinia/colada'
import { tv } from 'tailwind-variants'
import { computed } from 'vue'
import { deleteComment } from '../../../api/comments'
import { useFrontmatter } from '../../../composables/useFrontmatter'
import { useLocale } from '../../../composables/useLocale'
import { COMMENT_QUERY_KEY } from '../../../queries/comments'
import { getCommentById } from '../../../utils/comments'

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

const { frontmatter } = useFrontmatter()
const queryCache = useQueryCache()
const { mutate } = useMutation({
  mutation: ({ commentId }: { commentId: number, parentCommentId?: number }) => deleteComment(commentId),

  onMutate: () => {
    const oldComments = queryCache.getQueryData<{ data: Comment[] }>(COMMENT_QUERY_KEY.byPageId(frontmatter.value.id))!

    const newComments = structuredClone(oldComments)

    if (props.parentComment?.id) {
      const comment = getCommentById(newComments.data, props.comment.id, props.parentComment.id)

      if (comment) {
        comment.replies = comment.replies.filter(reply => reply.id !== props.comment.id)
      }
    }
    else {
      newComments.data.splice(
        newComments.data.findIndex(c => c.id === props.comment.id),
        1,
      )
    }

    queryCache.setQueryData(COMMENT_QUERY_KEY.byPageId(frontmatter.value.id), newComments)
    queryCache.cancelQueries({ key: COMMENT_QUERY_KEY.byPageId(frontmatter.value.id) })

    return { oldComments, newComments }
  },

  onSuccess: () => {
    // TODO: show a message?
  },

  onError: (_, __, { oldComments, newComments }) => {
    if (newComments === queryCache.getQueryData(COMMENT_QUERY_KEY.byPageId(frontmatter.value.id))) {
      queryCache.setQueryData(COMMENT_QUERY_KEY.byPageId(frontmatter.value.id), oldComments)
    }

    // TODO: show a message?
  },

  onSettled: () => {
    queryCache.invalidateQueries({ key: COMMENT_QUERY_KEY.byPageId(frontmatter.value.id) })
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

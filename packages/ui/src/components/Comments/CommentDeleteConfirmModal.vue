<script lang="ts">
import type { CommentsBanner } from '../../composables/comments/useCommentsBanner.ts'
import type { LocaleCode } from '../../locale/type.ts'
import { useMutation, useQueryCache } from '@pinia/colada'
import { tv } from 'tailwind-variants'
import { computed } from 'vue'
import { deleteComment } from '../../api/comments.ts'
import { useLocale } from '../../composables/useLocale.ts'
import { COMMENT_QUERY_KEYS } from '../../keys/comments.ts'
import ConfirmModal from '../ConfirmModal.vue'

const commentDeleteConfirmModal = tv({
  slots: {
    base: '',
  },
})

export interface CommentDeleteConfirmModalProps {
  pageId: string
  commentId: number
  locale: LocaleCode
  show: (banner: CommentsBanner) => void
  class?: any
  ui?: Partial<typeof commentDeleteConfirmModal.slots>
}
export interface CommentDeleteConfirmModalEmits {
  close: []
}
export interface CommentDeleteConfirmModalSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<CommentDeleteConfirmModalProps>()
const emit = defineEmits<CommentDeleteConfirmModalEmits>()
defineSlots<CommentDeleteConfirmModalSlots>()

const { t } = useLocale()
const queryCache = useQueryCache()

const { mutate, isLoading } = useMutation({
  mutation: ({ commentId, locale }: { commentId: number, locale: LocaleCode }) => deleteComment(commentId, locale),
  onSuccess: () => {
    props.show({
      kind: 'success',
      message: t('comments.success.delete'),
    })
  },
  onError: () => {
    props.show({
      kind: 'error',
      message: t('comments.errors.delete'),
    })
  },
  onSettled: async () => {
    await queryCache.invalidateQueries({ key: COMMENT_QUERY_KEYS.byPageId(props.pageId, props.locale) })

    emit('close')
  },
})

function onClose() {
  emit('close')
}

function onConfirm() {
  mutate({
    commentId: props.commentId,
    locale: props.locale,
  })
}

const ui = computed(() => commentDeleteConfirmModal())
</script>

<template>
  <ConfirmModal
    :title="t('comments.CommentDeleteConfirmModal.title')"
    :description="t('comments.CommentDeleteConfirmModal.description')"
    :loading="isLoading"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
    @close="onClose"
    @confirm="onConfirm"
  />
</template>

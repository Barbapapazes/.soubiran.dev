<script lang="ts">
import type { LocaleCode } from '../../locale/type.ts'
import type { Comment } from '../../types/comment'
import { useMutation, useQueryCache } from '@pinia/colada'
import { tv } from 'tailwind-variants'
import { computed, ref, useTemplateRef } from 'vue'
import { postComment, putComment } from '../../api/comments.ts'
import { useCommentsContext } from '../../composables/comments/context'
import { useLocale } from '../../composables/useLocale'
import { COMMENT_QUERY_KEYS } from '../../keys/comments.ts'
import { isUnprocessableEntityError } from '../../utils/api.ts'
import Editor from '../Editor.vue'
import Form from '../Form.vue'

const commentForm = tv({
  base: 'space-y-2',
})

export interface CommentFormProps {
  cancelable?: boolean
  parentComment?: Comment
  comment?: Comment
  class?: any
}
export interface CommentFormEmits {
  cancel: [void]
  success: [void]
}
export interface CommentFormSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<CommentFormProps>()
const emits = defineEmits<CommentFormEmits>()
defineSlots<CommentFormSlots>()

const formData = ref({
  content: props.comment?.content || '',
})

const { t } = useLocale()
const { locale, pageId } = useCommentsContext()

const contentError = ref<string>()
const queryCache = useQueryCache()
const { mutate: createComment, isLoading: isCreateCommentLoading } = useMutation({
  mutation: ({
    pageId,
    content,
    locale,
    parentCommentId,
  }: {
    pageId: string
    content: string
    locale: LocaleCode
    parentCommentId?: number
  }) => postComment(
    pageId,
    content,
    locale,
    parentCommentId,
  ),
  onError: (error) => {
    if (isUnprocessableEntityError(error)) {
      contentError.value = error.data.message
    }
    else {
      contentError.value = t('comments.errors.create')
    }
  },
  onSuccess: () => {
    clearFormData()
    emits('success')
  },
  onSettled: () => {
    queryCache.invalidateQueries({
      key: COMMENT_QUERY_KEYS.byPageId(pageId.value, locale.value),
    })
  },
})
const { mutate: updateComment, isLoading: isUpdateCommentLoading } = useMutation({
  mutation: ({
    commentId,
    content,
    locale,
  }: {
    commentId: number
    content: string
    locale: LocaleCode
  }) => putComment(
    commentId,
    content,
    locale,
  ),
  onError: (error) => {
    if (isUnprocessableEntityError(error)) {
      contentError.value = error.data.message
    }
    else {
      contentError.value = t('comments.errors.update')
    }
  },
  onSuccess: () => {
    clearFormData()
    emits('success')
  },
  onSettled: () => {
    queryCache.invalidateQueries({
      key: COMMENT_QUERY_KEYS.byPageId(pageId.value, locale.value),
    })
  },
})

const isLoading = computed(() => isCreateCommentLoading.value || isUpdateCommentLoading.value)

async function onSubmit() {
  if (isLoading.value || !formData.value.content) {
    return
  }

  contentError.value = undefined

  if (props.comment) {
    updateComment({
      locale: locale.value,
      commentId: props.comment.id,
      content: formData.value.content,
    })
  }
  else {
    createComment({
      pageId: pageId.value,
      locale: locale.value,
      content: formData.value.content,
      parentCommentId: props.parentComment?.id,
    })
  }
}

function onEditorKeydown(event: KeyboardEvent) {
  if (event.key !== 'Enter' || (!event.ctrlKey && !event.metaKey)) {
    return
  }

  event.preventDefault()
  void onSubmit()
}

function clearFormData() {
  formData.value = {
    content: '',
  }
}

function onCancel() {
  if (!isLoading.value) {
    emits('cancel')
  }
}

const editor = useTemplateRef('editor')
function focus() {
  editor.value?.focus()
}
defineExpose({
  focus,
})

const ui = computed(() => commentForm({ class: props.class }))
</script>

<template>
  <Form :class="ui" @submit="onSubmit">
    <Editor
      ref="editor"
      v-model:content="formData.content"
      :error="contentError"
      @keydown="onEditorKeydown"
    />

    <template #actions>
      <UButton
        v-if="props.cancelable"
        variant="link"
        :label="t('comments.CommentForm.actions.cancel')"
        :disabled="isLoading"
        @click="onCancel"
      />
      <UButton
        :disabled="!formData.content"
        :loading="isLoading"
        type="submit"
        :label="props.comment
          ? t('comments.CommentForm.actions.edit')
          : props.parentComment ? t('comments.CommentForm.actions.reply') : t('comments.CommentForm.actions.add')"
      />
    </template>
  </Form>
</template>

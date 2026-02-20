<script lang="ts">
import type { Comment } from '../../types/comment'
import UButton from '@nuxt/ui/components/Button.vue'
import { useMutation, useQueryCache } from '@pinia/colada'
import { tv } from 'tailwind-variants'
import { computed, ref, useTemplateRef } from 'vue'
import { postComment, putComment } from '../../api/comments'
import { useLocale } from '../../composables/useLocale'
import { COMMENT_QUERY_KEY } from '../../queries/comments'
import Editor from '../Editor.vue'
import Form from '../Form.vue'

const commentForm = tv({
  base: 'space-y-2',
})

export interface CommentFormProps {
  id: string
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
  parentId: props.parentComment?.id,
})

const { t } = useLocale()

const queryCache = useQueryCache()

const { mutateAsync: addComment, isLoading: isAddCommentLoading, error: addCommentError } = useMutation<
  {
    data: Comment
  },
  { postId: string, content: string, parentId?: number },
  {
    data: {
      message: string
      errors: {
        content: string[]
      }
    }
  }
>({
  mutation: ({ postId, content, parentId }) => postComment(postId, content, parentId),
  onSuccess: () => {
    clearFormData()
    emits('success')
  },
  onSettled: () =>
    queryCache.invalidateQueries({ key: COMMENT_QUERY_KEY.byPageId(props.id), exact: true }),
})

const { mutateAsync: updateComment, isLoading: isUpdateCommentLoading, error: updateCommentError } = useMutation<
  {
    data: Comment
  },
  { commentId: number, content: string, parentId?: number },
  {
    data: {
      message: string
      errors: {
        content: string[]
      }
    }
  }
>({
  mutation: ({ commentId, content }) => putComment(commentId, content),
  onSuccess: () => {
    clearFormData()
    emits('success')
  },
  onSettled: () =>
    queryCache.invalidateQueries({ key: COMMENT_QUERY_KEY.byPageId(props.id), exact: true }),
})

const isLoading = computed(() => isAddCommentLoading.value || isUpdateCommentLoading.value)
const errors = computed(() => addCommentError.value?.data.errors || updateCommentError.value?.data.errors)

async function onSubmit() {
  if (props.comment) {
    const { data: comment } = await updateComment({
      commentId: props.comment.id,
      content: formData.value.content,
      parentId: formData.value.parentId,
    })
    highlightComment(comment)
  }
  else {
    const { data: comment } = await addComment({
      postId: props.id,
      content: formData.value.content,
      parentId: formData.value.parentId,
    })

    highlightComment(comment)
  }
}

function highlightComment(comment: Comment) {
  const commentElement = document.getElementById(comment.html_id)
  if (!commentElement)
    return

  const classList = ['outline-2', 'outline-inverted', 'outline-offset-2']
  commentElement.parentElement!.classList.add(...classList)
  setTimeout(() => {
    commentElement.parentElement!.classList.remove(...classList)
  }, 2000)

  window.scrollTo({
    top: commentElement.offsetTop - 100,
    behavior: 'smooth',
  })
}

function clearFormData() {
  formData.value.content = ''
}

function onCancel() {
  emits('cancel')
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
      :error="errors?.content[0]"
      @keydown.ctrl.enter.prevent="onSubmit"
    />

    <template #actions>
      <UButton
        v-if="props.cancelable"
        variant="link"
        :label="t('comments.CommentForm.actions.cancel')"
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

<script lang="ts">
import type { Comment } from '../../types/comment'
import UButton from '@nuxt/ui/components/Button.vue'
import { useMutation, useQueryCache } from '@pinia/colada'
import { tv } from 'tailwind-variants'
import { computed, ref, useTemplateRef } from 'vue'
import { postComment, putComment } from '../../api/comments'
import { useFrontmatter } from '../../composables/useFrontmatter'
import { useLocale } from '../../composables/useLocale'

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
  parentId: props.parentComment?.id,
})

// TODO: remove toast usage
// const { add } = useToast()

const { t } = useLocale()

const { frontmatter } = useFrontmatter()

const queryCache = useQueryCache()

// TODO: remove all the unvaluable optimistic updates and just invalidate the queries onSettled
// TODO: extract and use a watcher to check for error, ....
const { mutate: addComment, isLoading: isAddCommentLoading, error: addCommentError } = useMutation<
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

  onSuccess: ({ data: comment }, { parentId }) => {
    const oldComments = queryCache.getQueryData<Comment[]>(['comments', frontmatter.value.id]) || [] as Comment[]

    // Since it's a deep nested array, we need to clone it to trigger the reactivity
    const newComments = JSON.parse(JSON.stringify(oldComments)) as Comment[]

    if (parentId) {
      const parentComment = newComments.find(c => c.id === parentId)
      if (parentComment) {
        parentComment.replies.push(comment)
      }
    }
    else {
      newComments.push(comment)
    }

    queryCache.setQueryData(['comments', frontmatter.value.id], newComments)
    queryCache.cancelQueries({ key: ['comments', frontmatter.value.id], exact: true })

    // TODO: remove toasts, use something else in the UI
    // const toastContent = parentId
    //   ? theme.value.comments.mutations.addComment.replyAdded
    //   : theme.value.comments.mutations.addComment.commentAdded

    // add({
    //   ...toastContent,
    //   color: 'success',
    // })

    clearFormData()

    emits('success')
  },
  // onError: (error) => {
  //   // if (error instanceof FetchError) {
  //   //   return
  //   // }

  //   // TODO: remove toasts, use something else in the UI
  //   // add({
  //   //   ...theme.value.comments.mutations.addComment.somethingWentWrong,
  //   //   color: 'error',
  //   // })
  // },

  onSettled: () =>
    queryCache.invalidateQueries({ key: ['comments', frontmatter.value.id], exact: true }),
})

const { mutate: updateComment, isLoading: isUpdateCommentLoading, error: updateCommentError } = useMutation<
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

  onSuccess: (response, { parentId }) => {
    const oldComments = queryCache.getQueryData<Comment[]>(['comments', frontmatter.value.id]) || [] as Comment[]

    // Since it's a deep nested array, we need to clone it to trigger the reactivity
    const newComments = JSON.parse(JSON.stringify(oldComments)) as Comment[]

    if (parentId) {
      const parentComment = newComments.find(c => c.id === parentId)
      if (parentComment) {
        const replyIndex = parentComment.replies.findIndex(r => r.id === response.data.id)

        if (replyIndex !== -1) {
          parentComment.replies[replyIndex] = response.data
        }
      }
    }
    else {
      const commentIndex = newComments.findIndex(c => c.id === response.data.id)
      if (commentIndex !== -1) {
        newComments[commentIndex] = response.data
      }
    }

    queryCache.setQueryData(['comments', frontmatter.value.id], newComments)
    queryCache.cancelQueries({ key: ['comments', frontmatter.value.id], exact: true })

    // TODO: remove toasts, use something else in the UI
    // const toastContent = parentId
    //   ? theme.value.comments.mutations.updateComment.replyUpdated
    //   : theme.value.comments.mutations.updateComment.commentUpdated

    // add({
    //   ...toastContent,
    //   color: 'success',
    // })

    clearFormData()

    emits('success')
  },

  // onError: (error) => {
  //   if (error instanceof FetchError) {
  //     return
  //   }

  //   // TODO: remove toasts, use something else in the UI
  //   // add({
  //   //   ...theme.value.comments.mutations.updateComment.somethingWentWrong,
  //   //   color: 'error',
  //   // })
  // },

  onSettled: () =>
    queryCache.invalidateQueries({ key: ['comments', frontmatter.value.id], exact: true }),
})

const isLoading = computed(() => isAddCommentLoading.value || isUpdateCommentLoading.value)
const errors = computed(() => addCommentError.value?.data.errors || updateCommentError.value?.data.errors)

function onSubmit() {
  if (props.comment) {
    updateComment({
      commentId: props.comment.id,
      content: formData.value.content,
      parentId: formData.value.parentId,
    })
  }
  else {
    addComment({
      postId: frontmatter.value.id,
      content: formData.value.content,
      parentId: formData.value.parentId,
    })
  }
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

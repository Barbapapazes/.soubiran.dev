import type { Comment } from '../types/comment'
import { defineMutation, useMutation, useQueryCache } from '@pinia/colada'
import { deleteComment } from '../api/comments'
import { useFrontmatter } from '../composables/useFrontmatter'
import { getCommentById } from './_utils'

export const useDeleteComment = defineMutation(() => {
  const { frontmatter } = useFrontmatter()
  const queryCache = useQueryCache()

  return useMutation({
    mutation: ({ commentId }: { commentId: number, parentCommentId?: number }) => deleteComment(commentId),

    // TODO: remove optimistic update when deleted a comment
    onSuccess: (_, { commentId, parentCommentId }) => {
      const oldComments = queryCache.getQueryData<Comment[]>(['comments', frontmatter.value.id]) || [] as Comment[]

      const newComments = JSON.parse(JSON.stringify(oldComments)) as Comment[]

      if (parentCommentId) {
        const comment = getCommentById(newComments, commentId, parentCommentId)

        if (comment) {
          comment.replies = comment.replies.filter(c => c.id !== commentId)
        }
      }
      else {
        newComments.splice(newComments.findIndex(c => c.id === commentId), 1)
      }

      queryCache.setQueryData(['comments', frontmatter.value.id], newComments)
      queryCache.cancelQueries({ key: ['comments', frontmatter.value.id], exact: true })

      // TODO: remove toasts, use something else in the UI
      // add({
      //   ...toastContent,
      //   color: 'success',
      // })
    },
    onError: () => {
      // TODO: remove toasts, use something else in the UI
      // add({
      //   ...theme.value.comments.mutations.deleteComment.somethingWentWrong,
      //   color: 'error',
      // })

      // TODO: rollback optimistic update
    },

    onSettled: () =>
      queryCache.invalidateQueries({ key: ['comments', frontmatter.value.id], exact: true }),
  })
})

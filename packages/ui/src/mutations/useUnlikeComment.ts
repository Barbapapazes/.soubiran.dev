import type { Comment } from '../types/comment'
import { defineMutation, useMutation, useQueryCache } from '@pinia/colada'
import { deleteCommentLike } from '../api/comments'
import { useFrontmatter } from '../composables/useFrontmatter'
import { useUser } from '../queries/useUser'
import { getCommentById } from './_utils'

export const useUnlikeComment = defineMutation(() => {
  const { data: user } = useUser()
  const queryCache = useQueryCache()
  const { frontmatter } = useFrontmatter()

  return useMutation({
    mutation: ({ commentId }: { parentCommentId?: number, commentId: number }) => deleteCommentLike(commentId),

    onMutate: ({ commentId, parentCommentId }) => {
      const oldComments = queryCache.getQueryData<Comment[]>(['comments', frontmatter.value.id]) || [] as Comment[]

      const newComments = JSON.parse(JSON.stringify(oldComments)) as Comment[]

      const comment = getCommentById(newComments, commentId, parentCommentId)
      if (comment) {
        // TODO: fix the username
        comment.likes = comment.likes.filter(name => name !== user.value?.username)
      }

      queryCache.setQueryData(['comments', frontmatter.value.id], newComments)
      queryCache.cancelQueries({ key: ['comments', frontmatter.value.id], exact: true })

      return { oldComments }
    },
    onSuccess: () => {
      // TODO: remove toasts, use something else in the UI
      // add({
      //   ...theme.value.comments.mutations.likeComment.liked,
      //   color: 'success',
      // })
    },
    onError: (_, __, { oldComments }) => {
      // Rollback the comment likes
      if (oldComments) {
        queryCache.setQueryData(['comments', frontmatter.value.id], oldComments)
      }

      // TODO: remove toasts, use something else in the UI
      // add({
      //   ...theme.value.comments.mutations.unlikeComment.somethingWentWrong,
      //   color: 'error',
      // })
    },

    onSettled: () =>
      queryCache.invalidateQueries({ key: ['comments', frontmatter.value.id], exact: true }),
  })
})

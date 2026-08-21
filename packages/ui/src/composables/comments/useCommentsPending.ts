import { createSharedComposable } from '@vueuse/core'
import { reactive } from 'vue'

export const useCommentsPending = createSharedComposable(() => {
  const pendingLikeIds = reactive(new Set<number>())

  function tryAddPendingLike(commentId: number) {
    if (pendingLikeIds.has(commentId)) {
      return false
    }

    pendingLikeIds.add(commentId)
    return true
  }

  function removePendingLike(commentId: number) {
    pendingLikeIds.delete(commentId)
  }

  function isLikePending(commentId: number) {
    return pendingLikeIds.has(commentId)
  }

  return {
    tryAddPendingLike,
    removePendingLike,
    isLikePending,
  }
})

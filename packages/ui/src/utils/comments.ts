import type { Comment } from '../types/comment'

/**
 * Retrieve a comment by its ID. If the comment is a reply, the parent comment ID should be provided.
 */
export function getCommentById(comments: Comment[], commentId: number, parentCommentId?: number): Comment | undefined {
  if (parentCommentId !== undefined) {
    const parentComment = comments.find(c => c.id === parentCommentId)

    return parentComment?.replies.find(c => c.id === commentId)
  }

  return comments.find(c => c.id === commentId)
}

export function replaceComment(comments: Comment[], comment: Comment, parentCommentId?: number): Comment[] {
  if (parentCommentId === undefined) {
    let changed = false
    const nextComments = comments.map((currentComment) => {
      if (currentComment.id !== comment.id) {
        return currentComment
      }

      changed = true
      return comment
    })

    return changed ? nextComments : comments
  }

  let changed = false
  const nextComments = comments.map((currentComment) => {
    if (currentComment.id !== parentCommentId) {
      return currentComment
    }

    const replies = replaceComment(currentComment.replies, comment)
    if (replies === currentComment.replies) {
      return currentComment
    }

    changed = true
    return { ...currentComment, replies }
  })

  return changed ? nextComments : comments
}

export function patchComment(
  comments: Comment[],
  commentId: number,
  patch: (comment: Comment) => Comment,
  parentCommentId?: number,
): Comment[] {
  const comment = getCommentById(comments, commentId, parentCommentId)
  if (!comment) {
    return comments
  }

  return replaceComment(comments, patch(comment), parentCommentId)
}

export function patchCommentLike(
  comments: Comment[],
  commentId: number,
  liked: boolean,
  parentCommentId?: number,
): Comment[] {
  return patchComment(comments, commentId, comment => ({
    ...comment,
    likes: Math.max(0, comment.likes + (liked ? 1 : -1)),
    can: {
      ...comment.can,
      like: !liked,
      unlike: liked,
    },
  }), parentCommentId)
}

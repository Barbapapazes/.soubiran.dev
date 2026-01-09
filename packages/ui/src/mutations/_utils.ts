import type { Comment } from '../types/comment'

/**
 * Retrieve a comment by its ID. If the comment is a reply, the parent comment ID should be provided.
 */
export function getCommentById(comments: Comment[], commentId: number, parentCommentId?: number): Comment | undefined {
  if (parentCommentId) {
    const parentComment = comments.find(c => c.id === parentCommentId)

    if (parentComment) {
      return parentComment.replies.find(c => c.id === commentId)
    }
  }
  else {
    return comments.find(c => c.id === commentId)
  }
}

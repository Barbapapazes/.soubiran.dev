import type { CommentResponse, CommentUserResponse } from '../api/comments'
import type { Comment } from '../types/comment'
import type { User } from '../types/user'

function mapCommentUserResponse(user: CommentUserResponse): User {
  return {
    id: user.id,
    name: user.name,
    avatar: user.avatar,
    admin_url: user.admin_url,
    google_id: user.google_id,
    github_id: user.github_id,
    can: {
      view_admin: user.can.view_admin,
    },
  }
}

export function mapCommentResponse(comment: CommentResponse): Comment {
  return {
    html_id: comment.html_id,
    id: comment.id,
    content: comment.content,
    content_html: comment.content_html,
    user: mapCommentUserResponse(comment.user),
    createdAt: new Date(comment.created_at),
    can: {
      update: comment.can.update,
      delete: comment.can.delete,
      like: comment.can.like,
      unlike: comment.can.unlike,
    },
    replies: comment.replies?.map(mapCommentResponse),
    likes: comment.likes,
  }
}

import { api } from '../utils/api'

export const fetchMarkdown = (content: string) => api('/api/markdown', { method: 'POST', body: { content } })

export const fetchComments = (postId: string) => api(`/api/posts/${postId}/comments`)

export const postComment = (postId: string, content: string, parentCommentId?: number) => api(`/api/posts/${postId}/comments`, { method: 'POST', body: { content, parent_id: parentCommentId } })
export const putComment = (commentId: number, content: string) => api(`/api/comments/${commentId}`, { method: 'PUT', body: { content } })
export const deleteComment = (commentId: number) => api(`/api/comments/${commentId}`, { method: 'DELETE' })

export const postCommentLike = (commentId: number) => api(`/api/comments/${commentId}/likes`, { method: 'POST' })
export const deleteCommentLike = (commentId: number) => api(`/api/comments/${commentId}/likes`, { method: 'DELETE' })

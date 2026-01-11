import type { Comment } from '../types/comment'
import { api } from '../utils/api'

export const getMarkdown = (content: string) => api('/api/markdown', { method: 'POST', body: { content } })

export const getComments = (pageId: string) => api<{ data: Comment[] }>(`/api/posts/${pageId}/comments`)

export const postComment = (pageId: string, content: string, parentCommentId?: number) => api(`/api/posts/${pageId}/comments`, { method: 'POST', body: { content, parent_id: parentCommentId } })
export const putComment = (commentId: number, content: string) => api(`/api/comments/${commentId}`, { method: 'PUT', body: { content } })
export const deleteComment = (commentId: number) => api(`/api/comments/${commentId}`, { method: 'DELETE' })

export const postCommentLike = (commentId: number) => api(`/api/comments/${commentId}/likes`, { method: 'POST' })
export const deleteCommentLike = (commentId: number) => api(`/api/comments/${commentId}/likes`, { method: 'DELETE' })

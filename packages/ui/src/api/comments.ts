import type { Comment } from '../types/comment'
import { api } from '../utils/api'

export type CommentLocaleCode = 'en' | 'fr'

export interface Resource<T> {
  data: T
}

export interface Resources<T> {
  data: T[]
}

export interface CommentValidationErrorResponse {
  message?: string
  errors?: {
    content?: string[]
  }
}

const localizedHeaders = (locale: CommentLocaleCode) => ({ 'Accept-Language': locale })

export const getMarkdown = (content: string, locale: CommentLocaleCode) => api<{ data: string }>('/api/markdown', { method: 'POST', body: { content }, headers: localizedHeaders(locale) })

export const getComments = (pageId: string, locale: CommentLocaleCode) => api<Resources<Comment>>(`/api/pages/${pageId}/comments`, { headers: localizedHeaders(locale) })

export const postComment = (pageId: string, content: string, locale: CommentLocaleCode, parentCommentId?: number) => api<Resource<Comment>>(`/api/pages/${pageId}/comments`, { method: 'POST', body: { content, parent_id: parentCommentId }, headers: localizedHeaders(locale) })
export const putComment = (commentId: number, content: string, locale: CommentLocaleCode) => api<Resource<Comment>>(`/api/comments/${commentId}`, { method: 'PUT', body: { content }, headers: localizedHeaders(locale) })
export const deleteComment = (commentId: number, locale: CommentLocaleCode) => api<void>(`/api/comments/${commentId}`, { method: 'DELETE', headers: localizedHeaders(locale) })

export const postCommentLike = (commentId: number, locale: CommentLocaleCode) => api<void>(`/api/comments/${commentId}/likes`, { method: 'POST', headers: localizedHeaders(locale) })
export const deleteCommentLike = (commentId: number, locale: CommentLocaleCode) => api<void>(`/api/comments/${commentId}/likes`, { method: 'DELETE', headers: localizedHeaders(locale) })

import { api } from '../utils/api'

export type CommentLocaleCode = 'en' | 'fr'

export interface CommentUserResponse {
  id: number
  name: string
  avatar: string
  admin_url?: string
  google_id?: string
  github_id?: string
  can: {
    view_admin: boolean
  }
}

export interface CommentResponse {
  html_id: string
  id: number
  content: string
  content_html: string
  user: CommentUserResponse
  created_at: string
  can: {
    update: boolean
    delete: boolean
    like: boolean
    unlike: boolean
  }
  replies?: CommentResponse[]
  likes: number
}

export interface CommentsResponse {
  data: CommentResponse[]
}

export interface CommentResponseEnvelope {
  data: CommentResponse
}

export interface CommentValidationErrorResponse {
  message?: string
  errors?: {
    content?: string[]
  }
}

const localizedHeaders = (locale: CommentLocaleCode) => ({ 'Accept-Language': locale })

export const getMarkdown = (content: string, locale: CommentLocaleCode) => api<{ data: string }>('/api/markdown', { method: 'POST', body: { content }, headers: localizedHeaders(locale) })

export const getComments = (pageId: string, locale: CommentLocaleCode) => api<CommentsResponse>(`/api/pages/${pageId}/comments`, { headers: localizedHeaders(locale) })

export const postComment = (pageId: string, content: string, locale: CommentLocaleCode, parentCommentId?: number) => api<CommentResponseEnvelope>(`/api/pages/${pageId}/comments`, { method: 'POST', body: { content, parent_id: parentCommentId }, headers: localizedHeaders(locale) })
export const putComment = (commentId: number, content: string, locale: CommentLocaleCode) => api<CommentResponseEnvelope>(`/api/comments/${commentId}`, { method: 'PUT', body: { content }, headers: localizedHeaders(locale) })
export const deleteComment = (commentId: number, locale: CommentLocaleCode) => api<void>(`/api/comments/${commentId}`, { method: 'DELETE', headers: localizedHeaders(locale) })

export const postCommentLike = (commentId: number, locale: CommentLocaleCode) => api<void>(`/api/comments/${commentId}/likes`, { method: 'POST', headers: localizedHeaders(locale) })
export const deleteCommentLike = (commentId: number, locale: CommentLocaleCode) => api<void>(`/api/comments/${commentId}/likes`, { method: 'DELETE', headers: localizedHeaders(locale) })

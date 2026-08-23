import { api } from '../utils/api'

export interface FeedbackValidationErrorResponse {
  errors?: {
    content?: string[]
    rating?: string[]
  }
}

export function postFeedback(pageId: string, rating: string, content: string) {
  return api<void>(`/api/pages/${pageId}/feedback`, {
    method: 'POST',
    body: { rating, content },
  })
}

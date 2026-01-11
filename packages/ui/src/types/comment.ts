import type { User } from './user'

export interface Comment {
  html_id: string
  id: number
  content: string
  content_html: string
  user: User
  created_at: {
    diff_for_humans: string
    formatted: string
  }
  can: {
    update: boolean
    delete: boolean
    like: boolean
    unlike: boolean
  }
  replies: Comment[]
  likes: string[]
}

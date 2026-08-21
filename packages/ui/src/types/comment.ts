import type { User } from './user'

export interface Comment {
  html_id: string
  id: number
  content: string
  content_html: string
  user: User
  createdAt: Date
  can: {
    update: boolean
    delete: boolean
    like: boolean
    unlike: boolean
  }
  replies?: Comment[]
  likes: number
}

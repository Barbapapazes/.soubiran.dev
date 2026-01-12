export interface User {
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

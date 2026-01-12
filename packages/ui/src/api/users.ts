import type { User } from '../types/user'
import { api } from '../utils/api'

export const getCurrentUser = () => api<{ data: User }>('/api/user')

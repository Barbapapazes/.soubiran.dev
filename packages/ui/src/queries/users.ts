import { defineQueryOptions } from '@pinia/colada'
import { getCurrentUser } from '../api/users'

export const USER_QUERY_KEY = {
  current: ['user'] as const,
}

export const currentUserQuery = defineQueryOptions(
  () => ({
    enabled: !import.meta.env.SSR,
    key: USER_QUERY_KEY.current,
    query: () => getCurrentUser(),
  }),
)

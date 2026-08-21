import { defineQueryOptions } from '@pinia/colada'
import { getCurrentUser } from '../api/users'
import { USER_QUERY_KEYS } from '../keys/user'

export const currentUserQuery = defineQueryOptions(
  () => ({
    key: USER_QUERY_KEYS.current,
    query: () => getCurrentUser().then(response => response.data),
    enabled: typeof window !== 'undefined',
  }),
)

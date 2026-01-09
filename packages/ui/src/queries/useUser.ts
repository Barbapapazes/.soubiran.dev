import type { User } from '../types/user'
import { defineQuery, useQuery } from '@pinia/colada'
import { getUser } from '../api/users'

export const useUser = defineQuery(() => {
  return useQuery<User>({
    key: ['user'],
    enabled: !import.meta.env.SSR,
    query: () => getUser()
      .then(response => response.data),
  })
})

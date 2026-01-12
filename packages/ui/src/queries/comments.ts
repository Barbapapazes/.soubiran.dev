import { defineQueryOptions } from '@pinia/colada'
import { getComments } from '../api/comments'

export const COMMENT_QUERY_KEY = {
  root: ['comments'] as const,
  byPageId: (pageId: string) => ['pages', pageId, ...COMMENT_QUERY_KEY.root] as const,
}

export const commentsByPageIdQuery = defineQueryOptions(
  ({ id }: { id: string }) => ({
    key: COMMENT_QUERY_KEY.byPageId(id),
    query: () => getComments(id),
  }),
)

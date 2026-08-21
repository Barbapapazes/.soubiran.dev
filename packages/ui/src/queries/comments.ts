import type { LocaleCode } from '../locale/type'
import { defineQueryOptions } from '@pinia/colada'
import { getComments } from '../api/comments'
import { COMMENT_QUERY_KEYS } from '../keys/comments'
import { mapCommentResponse } from '../mappers/comments'

export const getCommentsByPageQuery = defineQueryOptions(({ pageId, locale }: { pageId: string, locale: LocaleCode }) => ({
  key: COMMENT_QUERY_KEYS.byPageId(pageId, locale),
  query: () => getComments(pageId, locale).then(response => response.data.map(mapCommentResponse)),
  enabled: typeof window !== 'undefined',
}),
)

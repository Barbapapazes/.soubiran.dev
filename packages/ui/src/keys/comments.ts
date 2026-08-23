import type { LocaleCode } from '../locale/type'

export const COMMENT_QUERY_KEYS = {
  root: ['comments'] as const,
  byPageId: (pageId: string, locale: LocaleCode) => ['pages', pageId, locale, ...COMMENT_QUERY_KEYS.root] as const,
}

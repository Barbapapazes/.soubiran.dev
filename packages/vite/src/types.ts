import type { Options as MarkdownOptions } from 'unplugin-vue-markdown/types'
import type { AssertFn } from './markdown/assert'
import type { StructuredDataPageConfig } from './markdown/structured-data/types'

export type { BreadcrumbItem } from './markdown/structured-data/schemas/types'
export type { StructuredDataPageConfig } from './markdown/structured-data/types'

type ExtractPage = (id: string) => string | null

export interface Options {
  router?: {
    extractPage?: ExtractPage
  } | false
  markdown: {
    extractPage: ExtractPage
    options?: MarkdownOptions
  } | false
  seo?: {
    assert?: {
      rules?: AssertFn
    }
    structuredData?: {
      pageConfig?: (page: string | null, frontmatter: Record<string, any>) => StructuredDataPageConfig
    }
  }
  api?: {
    categories?: string[]
  }
}

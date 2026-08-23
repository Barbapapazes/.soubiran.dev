import type { NuxtUIOptions } from '@nuxt/ui/vite'
import type { Options as MarkdownOptions } from 'unplugin-vue-markdown/types'
import type { AssertFn } from './markdown/assert'
import type { StructuredDataPageConfig } from './markdown/structured-data/types'
import type { ApiOptions } from './plugins/api'
import type { MetaOptions } from './plugins/meta'
import type { SitemapOptions } from './plugins/sitemap'
import type { SsgOptions } from './plugins/ssg'

export type { BreadcrumbItem } from './markdown/structured-data/schemas/types'
export type { StructuredDataPageConfig } from './markdown/structured-data/types'

type ExtractPage = (id: string) => string | null

export interface Options {
  title: string
  hostname: string
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
  ui?: NuxtUIOptions
  ssg?: SsgOptions | false
  meta?: MetaOptions | false
  api?: ApiOptions | false
  sitemap?: SitemapOptions | false
}

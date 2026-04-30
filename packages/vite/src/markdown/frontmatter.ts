import type { Options as MarkdownOptions } from 'unplugin-vue-markdown/types'
import type { StructuredDataPageConfig } from '../types'
import type { AssertFn } from './assert'
import { createAssert } from './assert'
import { canonical } from './canonical'
import { og } from './og'
import { structuredData } from './structured-data'

interface FrontmatterOptions {
  title: string
  hostname: string
  extractPage: (id: string) => string | null
  assertRules?: AssertFn
  getPageConfig?: (page: string | null, frontmatter: Record<string, any>) => StructuredDataPageConfig
}

export function markdownFrontmatterFactory(options: FrontmatterOptions): NonNullable<MarkdownOptions['frontmatterPreprocess']> {
  return (frontmatter, frontmatterOptions, id, defaults) => {
    const assert = createAssert(options.assertRules)
    assert(id, frontmatter)
    og(id, frontmatter, options.hostname)
    canonical(id, frontmatter, options.hostname)
    structuredData(id, frontmatter, {
      name: options.title,
      hostname: options.hostname,
      extractPage: options.extractPage,
      getPageConfig: options.getPageConfig,
    })

    frontmatter.page = options.extractPage(id)

    const head = defaults(frontmatter, frontmatterOptions)
    return { head, frontmatter }
  }
}

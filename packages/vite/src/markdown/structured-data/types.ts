import type { BreadcrumbItem } from './schemas/types'

export interface Options {
  name: string
  hostname: string
  url: string
}

export interface StructuredDataPageConfig {
  type: 'article' | 'collection' | 'default'
  breadcrumbItems?: BreadcrumbItem[]
}

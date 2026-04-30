import type { StructuredDataPageConfig } from './types'
import { toUrl } from '../../utils'
import { DEFAULT_PERSON } from './constants'
import { article } from './schemas/article'
import { breadcrumb } from './schemas/breadcrumb'
import { person } from './schemas/person'
import { webpage } from './schemas/webpage'
import { website } from './schemas/website'

interface Options {
  name: string
  hostname: string
  extractPage: (id: string) => string | null
  getPageConfig?: (page: string | null, frontmatter: Record<string, any>) => StructuredDataPageConfig
}

export function structuredData(
  id: string,
  frontmatter: Record<string, any>,
  options: Options,
) {
  const { name, hostname, extractPage, getPageConfig } = options
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [] as Record<string, any>[],
  }

  const structuredDataOptions = {
    name,
    hostname,
    url: toUrl(hostname),
  }

  const personData = person(DEFAULT_PERSON, structuredDataOptions)
  const websiteData = website({ person: personData }, structuredDataOptions)
  const webpageData = webpage(id, { website: websiteData }, {
    title: frontmatter.title,
    description: frontmatter.description,
    datePublished: frontmatter.date ? new Date(frontmatter.date) : undefined,
    keywords: frontmatter.tags,
  }, structuredDataOptions)

  const page = extractPage(id)
  const pageConfig = getPageConfig?.(page, frontmatter)

  if (pageConfig?.type === 'article') {
    const articleData = article(
      id,
      { person: personData, webpage: webpageData },
      {
        title: frontmatter.title,
        description: frontmatter.description,
      },
      structuredDataOptions,
    )

    graph['@graph'].push(articleData.data)

    if (pageConfig.breadcrumbItems) {
      const breadcrumbData = breadcrumb(id, pageConfig.breadcrumbItems, structuredDataOptions)
      graph['@graph'].push(breadcrumbData.data)
      webpageData.setBreadcrumb(breadcrumbData)
    }
  }
  else if (pageConfig?.type === 'collection') {
    webpageData.setCollection()
  }

  graph['@graph'].push(
    personData.data,
    websiteData.data,
    webpageData.data,
  )

  frontmatter.script ??= []
  frontmatter.script.push({
    type: 'application/ld+json',
    innerHTML: JSON.stringify(graph),
  })
}

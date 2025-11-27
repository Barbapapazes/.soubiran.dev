import type { BreadcrumbItem } from './breadcrumb'
import { toUrl } from '../utils'
import { article } from './article'
import { breadcrumb } from './breadcrumb'
import { person } from './person'
import { webpage } from './webpage'
import { website } from './website'

interface StructuredDataOptions {
  name: string
  hostname: string
  extractPage: (id: string) => string | null
}

export function structuredData(id: string, frontmatter: Record<string, any>, options: StructuredDataOptions) {
  const { name, hostname, extractPage } = options
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [] as Record<string, any>[],
  }

  const structuredDataOptions = {
    name,
    hostname,
    url: toUrl(hostname),
  }

  const personData = person(structuredDataOptions)
  const websiteData = website({ person: personData }, structuredDataOptions)
  const webpageData = webpage(id, { website: websiteData }, {
    title: frontmatter.title,
    description: frontmatter.description,
    datePublished: frontmatter.date ? new Date(frontmatter.date) : undefined,
    keywords: frontmatter.tags,
  }, structuredDataOptions)

  const page = extractPage(id)
  if (page === 'platforms-show' || page === 'websites-show') {
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

    const breadcrumbItems: BreadcrumbItem[] = [
      {
        title: name,
        type: 'WebSite',
        url: toUrl(hostname),
      },
      {
        title: page === 'platforms-show' ? 'Platforms' : 'Websites',
        type: 'WebPage',
        url: toUrl(hostname, page === 'platforms-show' ? 'platforms' : 'websites'),
      },
      {
        title: frontmatter.title,
      },
    ]
    const breadcrumbData = breadcrumb(id, breadcrumbItems, structuredDataOptions)

    graph['@graph'].push(breadcrumbData.data)
    webpageData.setBreadcrumb(breadcrumbData)
  }
  else if (page === 'platforms-index' || page === 'websites-index') {
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

import type { Options } from '../types'
import type { breadcrumb } from './breadcrumb'
import type { WebPageData } from './types'
import type { website } from './website'
import { getCanonicalUrl } from '../../canonical'

interface Properties {
  title: string
  description: string
  datePublished?: Date
  keywords?: string[]
}

/**
 * @see https://developer.yoast.com/features/schema/pieces/webpage/
 */
export function webpage(
  id: string,
  structuredData: { website: ReturnType<typeof website> },
  properties: Properties,
  options: Options,
) {
  const {
    title,
    description,
    datePublished,
    keywords,
  } = properties

  const canonicalUrl = getCanonicalUrl(id, options.hostname)

  const data: WebPageData = {
    '@type': 'WebPage',
    '@id': canonicalUrl,
    'url': canonicalUrl,
    'name': title,
    'description': description,
    'isPartOf': {
      '@id': structuredData.website.data['@id'],
    },
    'inLanguage': 'en-US',
    'potentialAction': [
      {
        '@type': 'ReadAction',
        'target': [
          canonicalUrl,
        ],
      },
    ],
    ...datePublished ? { datePublished: datePublished.toISOString() } : {},
    ...keywords ? { keywords } : {},
  }

  return {
    data,
    setBreadcrumb(breadcrumbData: ReturnType<typeof breadcrumb>) {
      data.breadcrumb = { '@id': breadcrumbData.data['@id'] }
    },
    setCollection() {
      data['@type'] = 'CollectionPage'

      delete data.potentialAction
    },
  }
}

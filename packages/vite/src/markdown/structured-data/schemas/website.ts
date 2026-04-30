import type { Options } from '../types'
import type { person } from './person'
import type { WebsiteData } from './types'
import { joinURL } from 'ufo'

/**
 * @see https://developer.yoast.com/features/schema/pieces/website/
 */
export function website(
  structuredData: { person: ReturnType<typeof person> },
  options: Options,
) {
  const data: WebsiteData = {
    '@type': 'WebSite',
    '@id': joinURL(options.url, '#', 'schema', 'WebSite', '1'),
    'url': options.url,
    'name': options.name,
    'inLanguage': ['en-US'],
    'publisher': {
      '@id': structuredData.person.data['@id'],
    },
  }

  return {
    data,
  }
}

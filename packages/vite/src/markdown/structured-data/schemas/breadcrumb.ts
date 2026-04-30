import type { Options } from '../types'
import type { BreadcrumbData, BreadcrumbItem } from './types'
import { joinURL } from 'ufo'
import { getUri, toUrl } from '../../../utils'

/**
 * @see https://developer.yoast.com/features/schema/pieces/breadcrumb/
 */
export function breadcrumb(
  id: string,
  items: BreadcrumbItem[],
  options: Options,
) {
  const data: BreadcrumbData = {
    '@type': 'BreadcrumbList',
    '@id': joinURL(toUrl(options.hostname), '#', 'schema', 'BreadcrumbList', getUri(id)),
    'itemListElement': items.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.title,
      ...item.type && item.url
        ? {
            item: {
              '@type': item.type,
              '@id': item.url,
            },
          }
        : {},
    } satisfies BreadcrumbData['itemListElement'][number])),
  }

  return {
    data,
  }
}

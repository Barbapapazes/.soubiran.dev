import type { Options } from '../types'
import type { person } from './person'
import type { ArticleData } from './types'
import type { webpage } from './webpage'
import { joinURL } from 'ufo'
import { getUri, toUrl } from '../../../utils'

interface Properties {
  title: string
  description: string
}

/**
 * @see https://developer.yoast.com/features/schema/pieces/article/
 */
export function article(
  id: string,
  structuredData: {
    person: ReturnType<typeof person>
    webpage: ReturnType<typeof webpage>
  },
  properties: Properties,
  options: Options,
) {
  const { title, description } = properties

  const data: ArticleData = {
    '@type': 'Article',
    '@id': joinURL(toUrl(options.hostname), '#', 'schema', 'Article', getUri(id)),
    'headline': title,
    'description': description,
    'isPartOf': {
      '@id': structuredData.webpage.data['@id'],
    },
    'mainEntityOfPage': {
      '@id': structuredData.webpage.data['@id'],
    },
    'datePublished': structuredData.webpage.data.datePublished ? structuredData.webpage.data.datePublished : undefined,
    'author': {
      '@id': structuredData.person.data['@id'],
    },
    'publisher': {
      '@id': structuredData.person.data['@id'],
    },
    'inLanguage': structuredData.webpage.data.inLanguage,
    // 'potentialAction': [
    //   {
    //     '@type': 'CommentAction',
    //     'name': 'Comment',
    //     'target': [
    //       `${webpageData.data['@id']}#comments`,
    //     ],
    //   },
    // ],
  }

  return {
    data,
  }
}

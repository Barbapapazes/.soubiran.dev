import type { Options } from '../types'
import type { PersonData } from './types'
import { joinURL } from 'ufo'

interface Properties {
  name: string
  sameAs: string[]
}

/**
 * @see https://developer.yoast.com/features/schema/pieces/person/
 */
export function person(
  properties: Properties,
  options: Options,
) {
  const data: PersonData = {
    '@type': 'Person',
    '@id': joinURL(options.url, '#', 'schema', 'Person', '1'),
    'name': properties.name,
    'sameAs': properties.sameAs,
  }

  return {
    data,
  }
}

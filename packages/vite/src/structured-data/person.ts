import type { Options } from './options'
import { joinURL } from 'ufo'

interface PersonData {
  '@type': 'Person'
  '@id': string
  'name': string
  'sameAs': string[]
}

export interface PersonOptions {
  name: string
  sameAs: string[]
}

/**
 * @see https://developer.yoast.com/features/schema/pieces/person/
 */
export function person(options: Options, personOptions: PersonOptions) {
  const data: PersonData = {
    '@type': 'Person',
    '@id': joinURL(options.url, '#', 'schema', 'Person', '1'),
    'name': personOptions.name,
    'sameAs': personOptions.sameAs,
  }

  return {
    data,
  }
}

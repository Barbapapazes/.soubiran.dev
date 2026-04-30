import { joinURL, withoutTrailingSlash } from 'ufo'
import { indexSuffixRE, markdownExtensionRE, vueExtensionRE } from './constants'

export function getUri(id: string) {
  return withoutTrailingSlash(id
    .split('/pages/')[1]
    .replace(markdownExtensionRE, '')
    .replace(vueExtensionRE, '')
    .replace(indexSuffixRE, ''))
}

export function toUrl(hostname: string, ...paths: string[]) {
  return joinURL(`https://${hostname}`, ...paths)
}

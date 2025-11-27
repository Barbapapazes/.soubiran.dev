import { joinURL, withoutTrailingSlash } from 'ufo'

export function getUri(id: string) {
  return withoutTrailingSlash(id.split('/pages/')[1].replace(/\.md$/, '').replace(/\.vue$/, '').replace(/index$/, ''))
}

export function toUrl(hostname: string, ...paths: string[]) {
  return joinURL(`https://${hostname}`, ...paths)
}

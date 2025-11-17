import { joinURL, withoutTrailingSlash } from 'ufo'

export function getUri(id: string) {
  return withoutTrailingSlash(id.split('/pages/')[1].replace(/\.md$/, '').replace(/\.vue$/, '').replace(/index$/, ''))
}

export function toUrl(hostname: string, ...paths: string[]) {
  return joinURL(`https://${hostname}`, ...paths)
}

export type Page = 'index' | 'platforms-index' | 'platforms-show' | 'websites-index' | 'websites-show' | 'ecosystem'
export function extractPage(id: string) {
  const uri = getUri(id)

  if (uri === '/') {
    return 'index'
  }

  if (uri === 'platforms') {
    return 'platforms-index'
  }

  if (uri.startsWith('platforms/')) {
    return 'platforms-show'
  }

  if (uri === 'websites') {
    return 'websites-index'
  }

  if (uri.startsWith('websites/')) {
    return 'websites-show'
  }

  if (uri === 'ecosystem') {
    return 'ecosystem'
  }

  return null
}

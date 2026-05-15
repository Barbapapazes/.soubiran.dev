import type { Plugin } from 'vite'
import { posix } from 'node:path'
import { cwd } from 'node:process'
import { yellow } from 'ansis'
import { withoutTrailingSlash } from 'ufo'
import { markdownExtensionRE } from '../constants'

const schemeRE = /^[a-z][\d+.-]*:/i
const markdownLinkRE = /\[[^\]]+\]\(([^)\s]+)\)/g

interface DeadLink {
  source: string
  href: string
  target: string
}

export default function (): Plugin {
  const knownPages = new Set<string>()
  const links: DeadLink[] = []
  let root = cwd()

  function normalizeId(id: string) {
    return id.split('?', 1)[0].replaceAll('\\', '/')
  }

  function toRelativePagePath(id: string) {
    const normalizedId = normalizeId(id)
    const pagesIndex = normalizedId.lastIndexOf('/pages/')
    if (pagesIndex < 0)
      return null

    return normalizedId.slice(pagesIndex + '/pages/'.length)
  }

  function toPageUri(path: string) {
    const normalizedPath = path.replaceAll('\\', '/').replace(/^\.$/, '')
    const extension = posix.extname(normalizedPath)

    if (extension && extension !== '.md')
      return null

    const pathWithoutExtension = extension === '.md'
      ? normalizedPath.replace(markdownExtensionRE, '')
      : normalizedPath
    const pathWithoutIndex = pathWithoutExtension.replace(/(^|\/)index$/, '')

    return `/${withoutTrailingSlash(pathWithoutIndex)}`
  }

  function normalizeLink(rawHref: string) {
    const href = rawHref.trim().replace(/^<|>$/g, '')
    const cleanHref = href.split('#', 1)[0].split('?', 1)[0]

    if (!cleanHref || cleanHref.startsWith('/') || cleanHref.startsWith('#') || cleanHref.startsWith('//') || schemeRE.test(cleanHref))
      return null

    return cleanHref
  }

  return {
    name: 'soubiran:dead-links',
    enforce: 'pre',
    configResolved(config) {
      root = config.root
    },
    transform(code, id) {
      if (!normalizeId(id).endsWith('.md'))
        return null

      const sourcePath = toRelativePagePath(id)
      if (!sourcePath)
        return null

      const sourceUri = toPageUri(sourcePath)
      if (!sourceUri)
        return null

      knownPages.add(sourceUri)

      for (const match of code.matchAll(markdownLinkRE)) {
        const href = normalizeLink(match[1]!)
        if (!href)
          continue

        const targetPath = posix.normalize(posix.join(posix.dirname(sourcePath), href))
        const targetUri = toPageUri(targetPath)
        if (!targetUri)
          continue

        links.push({
          source: sourceUri,
          href,
          target: targetUri,
        })
      }

      return null
    },
    closeBundle() {
      if (this.environment.name !== 'client')
        return

      const invalidLinks = links.filter(link => !knownPages.has(link.target))
      if (!invalidLinks.length)
        return

      const details = invalidLinks
        .map(link => `- ${link.source} -> ${link.href} (resolved: ${link.target})`)
        .join('\n')

      throw new Error(`${yellow('Dead markdown links found:')}\n${details}\n\nEnsure these links target an existing markdown page in ${root}/src/app/pages.`)
    },
  }
}

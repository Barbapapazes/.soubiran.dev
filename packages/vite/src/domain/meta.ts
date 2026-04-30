import type { Logger, Plugin, ResolvedConfig } from 'vite'
import { createHash } from 'node:crypto'
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { cwd } from 'node:process'
import { cyan, dim, green, yellow } from 'ansis'
import matter from 'gray-matter'
import { joinURL, withoutTrailingSlash } from 'ufo'
import { markdownExtensionRE } from '../constants'

interface PageMeta {
  id: string
  title: string
  uri: string
  url: string
  description?: string
  hash: string
}

interface PageData {
  uri: string
  title?: string
  description?: string
  content: string
  id: string
}

/**
 * Generate a hash of the content for change detection
 */
function generateContentHash(content: string): string {
  return createHash('sha256').update(content).digest('hex')
}

/**
 * Recursively scan all markdown files and extract metadata
 */
function scanPagesForMeta(pagesDir: string, baseUri = ''): PageData[] {
  const pages: PageData[] = []

  if (!existsSync(pagesDir)) {
    return pages
  }

  const entries = readdirSync(pagesDir)

  for (const entry of entries) {
    const fullPath = join(pagesDir, entry)
    const stat = statSync(fullPath)

    if (stat.isDirectory()) {
      // Recursively scan subdirectories
      const subPages = scanPagesForMeta(fullPath, `${baseUri}/${entry}`)
      pages.push(...subPages)
    }
    else if (entry.endsWith('.md')) {
      // Process markdown file
      const content = readFileSync(fullPath, 'utf-8')
      const parsed = matter(content)

      // Generate URI from file path
      let uri = baseUri
      if (entry !== 'index.md') {
        uri = joinURL(baseUri, entry.replace(markdownExtensionRE, ''))
      }
      uri = withoutTrailingSlash(uri)

      pages.push({
        uri,
        title: parsed.data.title,
        description: parsed.data.description,
        content: parsed.content,
        id: parsed.data.id,
      })
    }
  }

  return pages
}

/**
 * Generate meta.json file with all pages metadata
 */
export function generateMeta(outDir: string, hostname: string, logger: Logger) {
  const pagesDir = resolve(cwd(), 'pages')
  const distDir = resolve(cwd(), outDir)

  // Scan all pages and collect metadata
  const pagesData = scanPagesForMeta(pagesDir)

  // Convert to PageMeta format, filtering out pages without title
  const pages: PageMeta[] = pagesData
    .filter(page => page.title)
    .map(page => ({
      id: page.id,
      title: page.title!,
      description: page.description,
      uri: page.uri,
      url: joinURL(`https://${hostname}`, page.uri),
      hash: generateContentHash(page.content),
    }))

  // Sort pages by URI for consistent ordering
  pages.sort((a, b) => a.uri.localeCompare(b.uri))

  const metaPath = join(distDir, 'meta.json')
  writeFileSync(metaPath, JSON.stringify(pages, null, 2))

  logger.info(`${dim(`${outDir}/`)}${cyan(metaPath.replace(`${distDir}/`, ''))}`)
}

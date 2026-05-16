import type { Logger } from 'vite'
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { cwd } from 'node:process'
import { cyan, dim } from 'ansis'
import matter from 'gray-matter'
import { markdownExtensionRE } from '../constants'

/**
 * Recursively scan a directory for markdown files
 */
function scanMarkdownFiles(dir: string): string[] {
  const files: string[] = []

  try {
    const entries = readdirSync(dir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = join(dir, entry.name)

      if (entry.isDirectory()) {
        files.push(...scanMarkdownFiles(fullPath))
      }
      else if (entry.isFile() && entry.name.endsWith('.md') && entry.name !== 'index.md') {
        files.push(fullPath)
      }
    }
  }
  catch {
    // Directory doesn't exist, return empty array
  }

  return files
}

/**
 * Process a markdown file and extract its frontmatter
 */
function processMarkdownFile(filePath: string, category: string): Record<string, any> {
  const content = readFileSync(filePath, 'utf-8')
  const { data } = matter(content)

  // Extract the filename without extension to create the path
  const fileName = filePath.split('/').pop()?.replace(markdownExtensionRE, '') || ''
  const path = `/${category}/${fileName}`

  return {
    path,
    ...data,
  }
}

/**
 * Generates the pages API JSON files in dist/api directory
 */
export function generateJsonApi(
  outDir: string,
  categories: string[],
  logger: Logger,
) {
  const pagesDir = resolve(cwd(), 'src', 'app', 'pages')
  const distDir = resolve(cwd(), outDir)

  for (const name of categories) {
    const dir = join(pagesDir, name)

    const processedFiles = scanMarkdownFiles(dir).map(file => processMarkdownFile(file, name))

    const apiDir = join(distDir, 'api')
    const path = join(apiDir, `${name}.json`)

    mkdirSync(apiDir, { recursive: true })
    writeFileSync(path, JSON.stringify(processedFiles, null, 2))

    logger.info(`${dim(`${outDir}/`)}${cyan(path.replace(`${distDir}/`, ''))}`)
  }
}

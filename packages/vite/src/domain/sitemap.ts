import { createWriteStream } from 'node:fs'
import { join } from 'node:path'
import { SitemapStream } from 'sitemap'

export function generateSitemap(outDir: string, hostname: string, routes: string[]): void {
  const sitemapStream = new SitemapStream({ hostname: `https://${hostname}` })
  const sitemapPath = join(outDir, 'sitemap.xml')
  const writeStream = createWriteStream(sitemapPath)

  sitemapStream.pipe(writeStream)
  routes.forEach(item => sitemapStream.write(item))
  sitemapStream.end()
}

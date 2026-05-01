/// <reference types="vite-ssg" />
import type { Plugin, ResolvedConfig } from 'vite'
import { generateSitemap } from '../domain/sitemap'

export interface SitemapOptions {
  hostname: string
}

export default function (options: SitemapOptions): Plugin {
  const routes = new Set<string>()
  let config: ResolvedConfig

  return {
    name: 'soubiran:sitemap',
    config() {
      return {
        ssgOptions: {
          onPageRendered(route, renderedHTML) {
            routes.add(route)
            return renderedHTML
          },
          onFinished() {
            generateSitemap(config.build.outDir, options.hostname, Array.from(routes))
          },
        },
      }
    },
    configResolved(resolvedConfig) {
      config = resolvedConfig
    },
  }
}

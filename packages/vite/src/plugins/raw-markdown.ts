import type { Plugin, ResolvedConfig } from 'vite'
import { resolve } from 'node:path'
import { cwd } from 'node:process'
import { green, yellow } from 'ansis'
import { copyAndSanitizeMarkdownFiles } from '../domain/raw-markdown'

export default function (): Plugin {
  let config: ResolvedConfig

  return {
    name: 'markdown',
    configResolved(resolvedConfig) {
      config = resolvedConfig
    },
    closeBundle() {
      if (this.environment.name !== 'client') {
        return
      }

      const pagesDir = resolve(cwd(), 'src', 'app', 'pages')
      const distDir = resolve(cwd(), config.build.outDir)

      const time = Date.now()
      config.logger.info(yellow('Copy and Sanitize Markdown'))

      copyAndSanitizeMarkdownFiles(config.build.outDir, config.logger, pagesDir, distDir)

      config.logger.info(green(`✓ copied in ${Date.now() - time}ms`))
    },
  }
}

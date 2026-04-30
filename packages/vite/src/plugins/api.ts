import type { Plugin, ResolvedConfig } from 'vite'
import { green, yellow } from 'ansis'
import { generateJsonApi } from '../domain/api'

export default function (categories: string[] = []): Plugin {
  let config: ResolvedConfig

  return {
    name: 'api',
    configResolved(resolvedConfig) {
      config = resolvedConfig
    },
    closeBundle() {
      if (this.environment.name !== 'client') {
        return
      }

      if (categories.length === 0) {
        return
      }

      const time = Date.now()
      config.logger.info(yellow('Generate API files'))

      generateJsonApi(config.build.outDir, categories, config.logger)

      config.logger.info(green(`✓ generated in ${Date.now() - time}ms`))
    },
  }
}

import type { Plugin, ResolvedConfig } from 'vite'
import { green, yellow } from 'ansis'
import { generateJsonApi } from '../domain/api'

export interface ApiOptions {
  categories?: string[]
}

export default function (options: ApiOptions = {}): Plugin {
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

      if (!options.categories) {
        return
      }

      if (options.categories.length === 0) {
        return
      }

      const time = Date.now()
      config.logger.info(yellow('Generate API files'))

      generateJsonApi(config.build.outDir, options.categories, config.logger)

      config.logger.info(green(`✓ generated in ${Date.now() - time}ms`))
    },
  }
}

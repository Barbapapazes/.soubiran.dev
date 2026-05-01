import type { Plugin, ResolvedConfig } from 'vite'
import { green, yellow } from 'ansis'
import { generateMeta } from '../domain/meta'

export interface MetaOptions {
  hostname: string
}

export default function (options: MetaOptions): Plugin {
  let config: ResolvedConfig

  return {
    name: 'meta',
    configResolved(resolvedConfig: ResolvedConfig) {
      config = resolvedConfig
    },
    closeBundle() {
      if (this.environment.name !== 'client') {
        return
      }

      const time = Date.now()
      config.logger.info(yellow('Generate meta.json'))

      generateMeta(config.build.outDir, options.hostname, config.logger)

      config.logger.info(green(`✓ generated in ${Date.now() - time}ms`))
    },
  }
}

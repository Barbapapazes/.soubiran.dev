import type { PluginOption } from 'vite'
import type { Options } from './types'
import { factory } from './factory'

export default function soubiran(options: Options): PluginOption[] {
  const plugins = factory(options)

  return plugins
}

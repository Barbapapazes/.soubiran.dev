import type { Plugin } from 'vite'
import { resolve } from 'node:path'

export default function (): Plugin {
  return {
    name: 'soubiran:config',
    config() {
      return {
        optimizeDeps: {
          exclude: [
            '@soubiran/ui',
          ],
        },
        resolve: {
          alias: {
            '@': resolve('./src'),
          },
        },
      }
    },
  }
}

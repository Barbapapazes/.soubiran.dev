import type { Plugin } from 'vite'
import { resolveAll } from '../domain/promise'

export default function (): Plugin {
  return {
    name: 'soubiran:promise',
    async closeBundle() {
      await resolveAll()
    },
  }
}

/// <reference types="vite-ssg" />
import type { Plugin } from 'vite'

export default function (): Plugin {
  return {
    name: 'soubiran:ssg',
    config() {
      return {
        ssgOptions: {
          formatting: 'minify',
        },
      }
    },
  }
}

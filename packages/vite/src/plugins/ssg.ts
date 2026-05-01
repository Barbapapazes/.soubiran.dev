/// <reference types="vite-ssg" />
import type { Plugin } from 'vite'

export interface SsgOptions {}

export default function (options: SsgOptions = {}): Plugin {
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

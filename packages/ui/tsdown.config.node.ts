import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: [
    './src/resolver.ts',
    './src/imports.ts',
  ],
  platform: 'node',
  tsconfig: './tsconfig.node.json',
})

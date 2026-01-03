import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: [
    './vite.config.ts',
    './src/utils.ts',
  ],
  noExternal: [
    // Because of the patch, it's better to bundle it directly
    'markdown-it-table-of-contents',
  ],
  copy: [
    { from: 'src/og-template.svg', to: 'dist' },
  ],
})

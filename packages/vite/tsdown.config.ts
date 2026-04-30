import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: [
    './src/index.ts',
    './src/types.ts',
    './src/utils.ts',
  ],
  deps: {
    onlyBundle: false,
    alwaysBundle: [
      // Because of the patch, it's better to bundle it directly
      'markdown-it-table-of-contents',
    ],
  },
  copy: [
    { from: 'src/markdown/og-template.svg', to: 'dist' },
  ],
})

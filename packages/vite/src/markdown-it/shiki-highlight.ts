import type { MarkdownItAsync } from 'markdown-it-async'
import { fromAsyncCodeToHtml } from '@shikijs/markdown-it/async'
import {
  transformerMetaHighlight,
} from '@shikijs/transformers'
import { codeToHtml } from 'shiki'

export async function shikiHighlight(md: MarkdownItAsync) {
  md.use(fromAsyncCodeToHtml(
    codeToHtml,
    {
      defaultColor: false,
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      transformers: [
        transformerMetaHighlight(),
      ],
    },
  ))
}

import type { MarkdownItAsync } from 'markdown-it-async'
import linkAttributes from 'markdown-it-link-attributes'

const internalLinkRE = /^https?:\/\/(?:[a-z0-9-]+\.)?soubiran\.dev(?:[/?#]|$)/
const externalLinkRE = /^https?:\/\//

export function linkAttributesRule(md: MarkdownItAsync) {
  md.use(linkAttributes as any, [
    {
      matcher: (link: string) => internalLinkRE.test(link),
      attrs: {
        target: '_blank',
      },
    },
    {
      matcher: (link: string) => externalLinkRE.test(link),
      attrs: {
        target: '_blank',
        rel: 'noopener',
      },
    },
  ])
}

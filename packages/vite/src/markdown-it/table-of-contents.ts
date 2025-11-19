import type { MarkdownItAsync } from 'markdown-it-async'
import anchor from 'markdown-it-anchor'
// @ts-expect-error no types available
import { defaultOptions, findHeadlineElements, flatHeadlineItemsToNestedTree } from 'markdown-it-table-of-contents'

export function tableOfContentsRule(md: MarkdownItAsync) {
  md.use(anchor, {
    permalink: anchor.permalink.linkInsideHeader({
      symbol: '#',
      renderAttrs: () => ({ 'aria-hidden': 'true' }),
    }),
  })
  md.use((md) => {
    // Add a core rule that runs after all parsing is complete
    // This will extract headings and build the TOC tree, then inject it into env
    md.core.ruler.push('toc_to_env', (state) => {
      const options = defaultOptions
      const headlineItems = findHeadlineElements(options.includeLevel, state.tokens, options)
      const tocTree = flatHeadlineItemsToNestedTree(headlineItems)

      // Inject the TOC tree into the frontmatter object
      state.env.frontmatter = state.env.frontmatter || {}
      state.env.frontmatter.toc = tocTree

      return true
    })
  })
}

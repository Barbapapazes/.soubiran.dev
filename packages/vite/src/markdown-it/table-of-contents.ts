import type { MarkdownItAsync } from 'markdown-it-async'
// @ts-expect-error no types available
import { defaultOptions, findHeadlineElements, flatHeadlineItemsToNestedTree, getTokensText, slugify } from 'markdown-it-table-of-contents'

export function tableOfContentsRule(md: MarkdownItAsync) {
  md.use((md) => {
    md.renderer.rules.heading_open = (tokens, idx, options, _env, self) => {
      const token = tokens[idx]
      if (token.tag === 'h2' || token.tag === 'h3') {
        const inlineToken = tokens[idx + 1]
        const textContent = getTokensText(inlineToken.children)
        token.attrSet('id', slugify(textContent))
        return `<Heading :level="${token.tag.slice(1)}"${self.renderAttrs(token)}>`
      }
      return self.renderToken(tokens, idx, options)
    }

    md.renderer.rules.heading_close = (tokens, idx, options, _env, self) => {
      const token = tokens[idx]
      if (token.tag === 'h2' || token.tag === 'h3') {
        return '</Heading>'
      }
      return self.renderToken(tokens, idx, options)
    }
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
      state.env.frontmatter.toc = tocTree.children || []

      return true
    })
  })
}

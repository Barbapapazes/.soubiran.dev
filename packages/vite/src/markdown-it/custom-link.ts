import type { MarkdownItAsync } from 'markdown-it-async'

export function customLink(md: MarkdownItAsync, hostname: string) {
  md.use((md) => {
    const linkRule = md.renderer.rules.link_open!
    md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
      const token = tokens[idx]
      const href = token.attrGet('href')

      // Add UTM for internal links (including subdomains)
      if (href && /^https?:\/\/(?:[a-z0-9-]+\.)?soubiran\.dev(?:[/?#]|$)/.test(href)) {
        // Extract link text from the next token(s)
        let linkText = ''
        let nextIdx = idx + 1
        while (nextIdx < tokens.length && tokens[nextIdx].type !== 'link_close') {
          if (tokens[nextIdx].type === 'text' || tokens[nextIdx].type === 'code_inline') {
            linkText += tokens[nextIdx].content
          }
          else if (tokens[nextIdx].children) {
            // Handle inline tokens with children
            for (const child of tokens[nextIdx].children) {
              if (child.type === 'text' || child.type === 'code_inline') {
                linkText += child.content
              }
            }
          }
          nextIdx++
        }

        // Build URL with UTM parameters
        const url = new URL(href)
        url.searchParams.set('utm_source', hostname)
        url.searchParams.set('utm_medium', 'link')
        url.searchParams.set('utm_content', 'textlink')
        if (linkText) {
          url.searchParams.set('utm_term', linkText)
        }

        token.attrSet('href', url.toString())
      }

      return linkRule(tokens, idx, options, env, self)
    }
  })
}

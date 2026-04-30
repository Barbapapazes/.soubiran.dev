import type { Options as MarkdownOptions } from 'unplugin-vue-markdown/types'
import { customImage, customLink, githubAlerts, implicitFiguresRule, linkAttributesRule, shikiHighlight, tableOfContentsRule } from '../markdown-it'

export function markdownRulesFactory(hostname: string): NonNullable<MarkdownOptions['markdownItSetup']> {
  return async (md: any) => {
    githubAlerts(md)
    implicitFiguresRule(md)
    linkAttributesRule(md)
    tableOfContentsRule(md)
    customLink(md, hostname)
    customImage(md, hostname)
    await shikiHighlight(md)
  }
}

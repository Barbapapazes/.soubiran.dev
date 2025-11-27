import type { BreadcrumbItem, StructuredDataPageConfig } from '../../packages/vite/vite.config'
import { getUri, toUrl } from '../../packages/vite/src/utils'
import soubiran from '../../packages/vite/vite.config'

const hostname = 'infra.soubiran.dev'
const name = 'Estéban\'s Infra'

export default soubiran(name, hostname, {
  extractPage,
  markdown: {
    transforms: {
      before: (code: string, id: string) => {
        const page = extractPage(id)

        if (page?.endsWith('-show')) {
          return `${code}\n\n## Ecosystem`
        }

        return code
      },
    },
    wrapperComponent: (id) => {
      const page = extractPage(id)

      if (page === 'platforms-index') {
        return 'WrapperPlatforms'
      }

      if (page === 'websites-index') {
        return 'WrapperWebsites'
      }

      return 'WrapperContent'
    },
  },
  person: {
    name: 'Estéban Soubiran',
    sameAs: [
      'https://x.com/soubiran_',
      'https://www.linkedin.com/in/esteban25',
      'https://www.twitch.tv/barbapapazes',
      'https://www.youtube.com/@barbapapazes',
      'https://github.com/barbapapazes',
      'https://soubiran.dev',
      'https://esteban-soubiran.site',
      'https://barbapapazes.dev',
    ],
  },
  getPageConfig: (page, frontmatter): StructuredDataPageConfig => {
    if (page === 'platforms-show' || page === 'websites-show') {
      const breadcrumbItems: BreadcrumbItem[] = [
        {
          title: name,
          type: 'WebSite',
          url: toUrl(hostname),
        },
        {
          title: page === 'platforms-show' ? 'Platforms' : 'Websites',
          type: 'WebPage',
          url: toUrl(hostname, page === 'platforms-show' ? 'platforms' : 'websites'),
        },
        {
          title: frontmatter.title,
        },
      ]

      return {
        type: 'article',
        breadcrumbItems,
      }
    }

    if (page === 'platforms-index' || page === 'websites-index') {
      return { type: 'collection' }
    }

    return { type: 'default' }
  },
  assert: (id, frontmatter) => {
    // Check if this is a platform or website page (not index pages)
    const isPlatformOrWebsite = (id.includes('/platforms/') || id.includes('/websites/'))
      && !id.endsWith('index.md')

    // Validate url field for platform/website pages
    if (isPlatformOrWebsite && !frontmatter.url) {
      throw new Error(
        `Missing required field 'url' in frontmatter for file: ${id}`,
      )
    }

    // Validate repository field for platform/website pages
    if (isPlatformOrWebsite && !frontmatter.repository) {
      throw new Error(
        `Missing required field 'repository' in frontmatter for file: ${id}`,
      )
    }
  },
  apiCategories: ['websites', 'platforms'],
})

type Page = 'index' | 'platforms-index' | 'platforms-show' | 'websites-index' | 'websites-show' | 'ecosystem'

function extractPage(id: string): Page | null {
  const uri = getUri(id)

  if (uri === '/') {
    return 'index'
  }

  if (uri === 'platforms') {
    return 'platforms-index'
  }

  if (uri.startsWith('platforms/')) {
    return 'platforms-show'
  }

  if (uri === 'websites') {
    return 'websites-index'
  }

  if (uri.startsWith('websites/')) {
    return 'websites-show'
  }

  if (uri === 'ecosystem') {
    return 'ecosystem'
  }

  return null
}

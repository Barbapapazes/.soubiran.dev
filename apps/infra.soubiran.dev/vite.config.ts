import { getUri } from '../../packages/vite/src/utils'
import soubiran from '../../packages/vite/vite.config'

export default soubiran('Estéban\'s Infra', 'infra.soubiran.dev', {
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

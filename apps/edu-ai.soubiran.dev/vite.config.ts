import soubiran from '@soubiran/vite'
import { getUri } from '@soubiran/vite/utils'

const hostname = 'edu-ai.soubiran.dev'
const name = 'IA et Éducation'

export default soubiran(name, hostname, {
  extractPage,
  markdown: {
    wrapperComponent: () => {
      return 'WrapperContent'
    },
  },
  apiCategories: [],
})

type Page = 'index'

function extractPage(id: string): Page | null {
  const uri = getUri(id)

  if (uri === '/') {
    return 'index'
  }

  return null
}

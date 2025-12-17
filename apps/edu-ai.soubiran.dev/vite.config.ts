import { getUri } from '../../packages/vite/src/utils'
import soubiran from '../../packages/vite/vite.config'

const hostname = 'edu-ai.soubiran.dev'
const name = 'IA et Éducation'

export default soubiran(name, hostname, {
  extractPage,
  markdown: {
    wrapperComponent: () => {
      return 'WrapperContent'
    },
  },
  seo: {
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

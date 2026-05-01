import soubiran from '@soubiran/vite'
import { getUri } from '@soubiran/vite/utils'
import { defineConfig } from 'vite'

const hostname = 'edu-ai.soubiran.dev'
const name = 'IA et Éducation'

export default defineConfig({
  plugins: [soubiran(name, hostname, {
    router: {
      extractPage,
    },
    markdown: {
      extractPage,
      options: {
        wrapperComponent: () => {
          return 'WrapperContent'
        },
      },
    },
  })],
})

type Page = 'index'

function extractPage(id: string): Page | null {
  const uri = getUri(id)

  if (uri === '/') {
    return 'index'
  }

  return null
}

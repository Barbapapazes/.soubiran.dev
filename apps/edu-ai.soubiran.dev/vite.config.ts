import soubiran from '@soubiran/vite'
import { getUri } from '@soubiran/vite/utils'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [soubiran(
    {
      title: 'IA et Éducation',
      hostname: 'edu-ai.soubiran.dev',
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
    },
  )],
})

type Page = 'index'

function extractPage(id: string): Page | null {
  const uri = getUri(id)

  if (uri === '/') {
    return 'index'
  }

  return null
}

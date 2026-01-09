import type { ComponentResolver } from 'unplugin-vue-components'

const components: string[] = [
  'Comments',
  'Feedback',
  'Page',
  'PageTitle',
  'PageHeader',
  'Header',
  'Socials',
  'Sponsors',
  'Container',
  'ViewersCounter',
  'TableOfContents',
]

// TODO: Add a S previx, like U for Nuxt UI
export default function (): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (components.includes(name)) {
        return {
          name,
          from: '@soubiran/ui',
        }
      }
    },
  }
}

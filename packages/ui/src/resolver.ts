import type { ComponentResolver } from 'unplugin-vue-components'

const components: string[] = [
  'Comments',
  'Feedback',
  'LoginCallback',
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

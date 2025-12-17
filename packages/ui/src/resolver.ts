import type { ComponentResolver } from 'unplugin-vue-components'

const components: string[] = [
  'Page',
  'Header',
  'Socials',
  'Sponsors',
  'Feedback',
  'Container',
  'PageTitle',
  'PageHeader',
  'FeedbackCard',
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

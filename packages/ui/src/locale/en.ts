import type { LocaleMessages } from './type'
import { defineLocale } from '@nuxt/ui/composables/defineLocale'

export default defineLocale<LocaleMessages>({
  name: 'English',
  code: 'en',
  dir: 'ltr',
  messages: {
    discussions: {
      DiscussionsSectionTitle: {
        title: 'Comments',
      },
      DiscussionsSectionSubtitle: {
        comments: {
          plural: '{count} comments',
          singular: '{count} comment',
        },
        replies: {
          plural: '{count} replies',
          singular: '{count} reply',
        },
      },
    },
    state: {
      empty: 'No data to display',
      error: 'An error occurred while loading the data',
      pending: 'Loading data...',
    },
  },
})

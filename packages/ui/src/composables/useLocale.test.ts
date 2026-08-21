import { extendLocale } from '@nuxt/ui/composables/defineLocale'
import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import fr from '../locale/fr'
import { useLocale } from './useLocale'

describe('useLocale', () => {
  it('translates messages from a reactive locale override', () => {
    const locale = ref(extendLocale(fr, {
      messages: {
        discussions: {
          DiscussionsSectionTitle: {
            title: 'Commentaires personnalisés',
          },
        },
      },
    }))

    const { t } = useLocale(locale)

    expect(t('discussions.DiscussionsSectionTitle.title')).toBe('Commentaires personnalisés')
    expect(t('discussions.DiscussionsSectionSubtitle.replies.plural', { count: 2 })).toBe('2 réponses')
  })
})

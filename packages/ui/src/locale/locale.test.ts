import type { DeepPartial, LocaleMessages } from './type'
import { extendLocale } from '@nuxt/ui/composables/defineLocale'
import { describe, expect, it } from 'vitest'
import en from './en'

const messages = {
  discussions: {
    DiscussionsSectionTitle: {
      title: 'Community notes',
    },
  },
} satisfies DeepPartial<LocaleMessages>

describe('comments locale overrides', () => {
  it('merges nested overrides while preserving built-in messages', () => {
    const locale = extendLocale(en, { messages })

    expect(locale.messages.discussions.DiscussionsSectionTitle.title).toBe('Community notes')
    expect(locale.messages.Editor.placeholder).toBe(en.messages.Editor.placeholder)
  })
})

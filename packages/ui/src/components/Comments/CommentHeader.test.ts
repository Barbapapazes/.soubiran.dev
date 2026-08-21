import type { Comment } from '../../types/comment'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, provide, ref } from 'vue'
import { localeContextInjectionKey } from '../../composables/useLocale'
import en from '../../locale/en'
import fr from '../../locale/fr'
import CommentHeader from './CommentHeader.vue'

function createComment(): Comment {
  return {
    html_id: 'comment-1',
    id: 1,
    content: 'Comment',
    content_html: '<p>Comment</p>',
    user: {
      id: 1,
      name: 'Ada',
      avatar: '/ada.png',
      can: { view_admin: false },
    },
    createdAt: new Date('2026-08-19T11:59:00.000Z'),
    can: {
      update: false,
      delete: false,
      like: true,
      unlike: false,
    },
    replies: [],
    likes: 0,
  }
}

function mountCommentHeader(locale: typeof en | typeof fr) {
  const activeLocale = ref(locale)
  const Host = defineComponent({
    setup() {
      provide(localeContextInjectionKey, activeLocale)
      return () => h(CommentHeader, { comment: createComment() })
    },
  })

  return { activeLocale, wrapper: mount(Host) }
}

afterEach(() => {
  vi.useRealTimers()
})

describe('comment header', () => {
  it('renders an ISO datetime and updates localized relative time automatically', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-08-19T12:00:00.000Z'))
    const { wrapper } = mountCommentHeader(en)

    expect(wrapper.get('time').attributes('datetime')).toBe('2026-08-19T11:59:00.000Z')
    expect(wrapper.get('time').text()).toBe('1 minute ago')

    await vi.advanceTimersByTimeAsync(60_000)
    await nextTick()
    expect(wrapper.get('time').text()).toBe('2 minutes ago')

    wrapper.unmount()
  })

  it('reacts to the active locale', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-08-19T12:00:00.000Z'))
    const { activeLocale, wrapper } = mountCommentHeader(en)

    expect(wrapper.get('time').text()).toBe('1 minute ago')

    activeLocale.value = fr
    await nextTick()

    expect(wrapper.get('time').text()).toBe('il y a 1 minute')
    wrapper.unmount()
  })
})

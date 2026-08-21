import { describe, expect, it, vi } from 'vitest'
import { effectScope } from 'vue'
import { useCommentsBanner } from './useCommentsBanner'

function createBanner() {
  const scope = effectScope()
  const banner = scope.run(useCommentsBanner)

  if (!banner) {
    throw new Error('Unable to create comments banner scope.')
  }

  return { banner, scope }
}

describe('useCommentsBanner', () => {
  it('keeps a replacement visible when the previous timer expires', () => {
    vi.useFakeTimers()
    const { banner } = createBanner()

    banner.show({ kind: 'error', message: 'First' })
    vi.advanceTimersByTime(2_500)
    banner.show({ kind: 'success', message: 'Second' })
    vi.advanceTimersByTime(2_500)

    expect(banner.banner.value?.message).toBe('Second')

    vi.advanceTimersByTime(2_500)
    expect(banner.banner.value).toBeUndefined()
  })

  it('dismisses manually and clears its timer on disposal', () => {
    vi.useFakeTimers()
    const { banner, scope } = createBanner()

    banner.show({ kind: 'error', message: 'Failure' })
    banner.dismiss()
    expect(banner.banner.value).toBeUndefined()
    expect(vi.getTimerCount()).toBe(0)

    banner.show({ kind: 'success', message: 'Deleted' })
    scope.stop()
    expect(vi.getTimerCount()).toBe(0)
  })

  it('isolates state between instances', () => {
    vi.useFakeTimers()
    const first = createBanner().banner
    const second = createBanner().banner

    first.show({ kind: 'error', message: 'First' })

    expect(first.isActive.value).toBe(true)
    expect(second.isActive.value).toBe(false)
  })
})

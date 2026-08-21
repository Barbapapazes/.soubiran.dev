import { afterEach, describe, expect, it } from 'vitest'
import { effectScope } from 'vue'
import { useCommentsPending } from './useCommentsPending'

const scopes: ReturnType<typeof effectScope>[] = []

function usePendingInScope() {
  const scope = effectScope()
  scopes.push(scope)
  const pending = scope.run(() => useCommentsPending())

  if (!pending) {
    throw new Error('Unable to create comments pending scope.')
  }

  return pending
}

afterEach(() => {
  scopes.splice(0).forEach(scope => scope.stop())
})

describe('useCommentsPending', () => {
  it('serializes likes per comment across consumers', () => {
    const firstConsumer = usePendingInScope()
    const secondConsumer = usePendingInScope()

    expect(firstConsumer.tryAddPendingLike(1)).toBe(true)
    expect(secondConsumer.isLikePending(1)).toBe(true)
    expect(secondConsumer.tryAddPendingLike(1)).toBe(false)
    expect(secondConsumer.tryAddPendingLike(2)).toBe(true)

    firstConsumer.removePendingLike(1)
    expect(secondConsumer.isLikePending(1)).toBe(false)
    expect(secondConsumer.isLikePending(2)).toBe(true)
  })
})

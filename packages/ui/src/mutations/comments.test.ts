import type { App, EffectScope } from 'vue'
import type { CommentResponse } from '../api/comments'
import type { Comment } from '../types/comment'
import { PiniaColada, useQueryCache } from '@pinia/colada'
import { FetchError } from 'ofetch'
import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createApp, effectScope } from 'vue'
import { useCommentsPending } from '../composables/comments/useCommentsPending'
import { COMMENT_QUERY_KEYS } from '../keys/comments'
import {
  CommentMutationError,
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useToggleCommentLikeMutation,
  useUpdateCommentMutation,
} from './comments'

const api = vi.hoisted(() => ({
  deleteComment: vi.fn(),
  deleteCommentLike: vi.fn(),
  postComment: vi.fn(),
  postCommentLike: vi.fn(),
  putComment: vi.fn(),
}))

vi.mock('../api/comments', () => api)

function createCommentResponse(id: number, likes = 0): CommentResponse {
  return {
    html_id: `comment-${id}`,
    id,
    content: `Comment ${id}`,
    content_html: `<p>Comment ${id}</p>`,
    user: {
      id: 1,
      name: 'Ada',
      avatar: '/ada.png',
      can: { view_admin: false },
    },
    created_at: '2026-08-19T10:00:00.000Z',
    can: {
      update: true,
      delete: true,
      like: true,
      unlike: false,
    },
    replies: [],
    likes,
  }
}

function createComment(id: number, likes = 0): Comment {
  const response = createCommentResponse(id, likes)

  return {
    ...response,
    createdAt: new Date(response.created_at),
    user: {
      ...response.user,
      admin_url: undefined,
      google_id: undefined,
      github_id: undefined,
    },
    replies: [],
  }
}

function createDeferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (reason?: unknown) => void
  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise
    reject = rejectPromise
  })

  return { promise, reject, resolve }
}

let app: App
let scope: EffectScope

function runInTestScope<T>(composable: () => T) {
  const result = app.runWithContext(() => scope.run(composable))
  if (result === undefined) {
    throw new Error('Unable to run composable in the test scope.')
  }

  return result
}

beforeEach(() => {
  vi.clearAllMocks()
  app = createApp({ render: () => null })
  const pinia = createPinia()
  app.use(pinia)
  app.use(PiniaColada)
  setActivePinia(pinia)
  scope = effectScope()
})

afterEach(() => {
  scope.stop()
})

describe('comment mutations', () => {
  it('maps a created comment without updating the cache and invalidates the exact key on success', async () => {
    const deferred = createDeferred<{ data: CommentResponse }>()
    api.postComment.mockReturnValue(deferred.promise)
    const queryCache = runInTestScope(useQueryCache)
    const key = COMMENT_QUERY_KEYS.byPageId('post-id', 'fr')
    const cachedComments = [createComment(9)]
    queryCache.setQueryData(key, cachedComments)
    const invalidate = vi.spyOn(queryCache, 'invalidateQueries')
    const mutation = runInTestScope(useCreateCommentMutation)

    const promise = mutation.mutateAsync({
      pageId: 'post-id',
      locale: 'fr',
      content: '**Pending**',
    })

    expect(queryCache.getQueryData<Comment[]>(key)).toBe(cachedComments)

    const response = createCommentResponse(1)
    deferred.resolve({ data: response })

    await expect(promise).resolves.toMatchObject({
      id: 1,
      createdAt: new Date(response.created_at),
    })
    expect(queryCache.getQueryData<Comment[]>(key)).toBe(cachedComments)
    expect(api.postComment).toHaveBeenCalledWith('post-id', '**Pending**', 'fr', undefined)
    expect(invalidate).toHaveBeenCalledWith({
      exact: true,
      key,
    })
  })

  it('exposes typed inline validation without invalidating on failure', async () => {
    const fetchError = new FetchError('Validation failed')
    Object.defineProperty(fetchError, 'data', {
      value: { errors: { content: ['Content is required.'] } },
    })
    api.postComment.mockRejectedValue(fetchError)
    const queryCache = runInTestScope(useQueryCache)
    const invalidate = vi.spyOn(queryCache, 'invalidateQueries')
    const mutation = runInTestScope(useCreateCommentMutation)

    const promise = mutation.mutateAsync({
      pageId: 'post-id',
      locale: 'en',
      content: '',
    })

    await expect(promise).rejects.toMatchObject({
      name: 'CommentMutationError',
      contentError: 'Content is required.',
    })
    expect(mutation.error.value).toBeInstanceOf(CommentMutationError)
    expect(invalidate).not.toHaveBeenCalled()
  })

  it('does not update or delete cached comments directly and invalidates after each success', async () => {
    const key = COMMENT_QUERY_KEYS.byPageId('post-id', 'en')
    const queryCache = runInTestScope(useQueryCache)
    const cachedComments = [createComment(1)]
    queryCache.setQueryData(key, cachedComments)
    const invalidate = vi.spyOn(queryCache, 'invalidateQueries')
    const updatedResponse = createCommentResponse(1)
    updatedResponse.content = 'Edited'
    api.putComment.mockResolvedValue({ data: updatedResponse })
    const updateMutation = runInTestScope(useUpdateCommentMutation)

    await updateMutation.mutateAsync({
      pageId: 'post-id',
      locale: 'en',
      commentId: 1,
      content: 'Edited',
    })

    expect(queryCache.getQueryData<Comment[]>(key)).toBe(cachedComments)

    const deferred = createDeferred<void>()
    api.deleteComment.mockReturnValue(deferred.promise)
    const deleteMutation = runInTestScope(useDeleteCommentMutation)
    const deletion = deleteMutation.mutateAsync({
      pageId: 'post-id',
      locale: 'en',
      commentId: 1,
    })

    expect(queryCache.getQueryData<Comment[]>(key)).toBe(cachedComments)
    deferred.resolve(undefined)
    await deletion
    expect(queryCache.getQueryData<Comment[]>(key)).toBe(cachedComments)
    expect(invalidate).toHaveBeenCalledTimes(2)
    expect(invalidate).toHaveBeenNthCalledWith(1, { exact: true, key })
    expect(invalidate).toHaveBeenNthCalledWith(2, { exact: true, key })
  })

  it('serializes likes per comment and rolls back a failed optimistic update', async () => {
    const key = COMMENT_QUERY_KEYS.byPageId('post-id', 'en')
    const original = createComment(1, 2)
    const queryCache = runInTestScope(useQueryCache)
    queryCache.setQueryData(key, [original])
    const deferred = createDeferred<void>()
    api.postCommentLike.mockReturnValue(deferred.promise)
    const mutation = runInTestScope(useToggleCommentLikeMutation)

    const variables = {
      pageId: 'post-id',
      locale: 'en' as const,
      commentId: 1,
      shouldLike: true,
    }
    const firstMutation = mutation.mutateAsync(variables)

    await vi.waitFor(() => {
      expect(queryCache.getQueryData<Comment[]>(key)?.[0]).toMatchObject({
        likes: 3,
        can: { like: false, unlike: true },
      })
    })

    await expect(mutation.mutateAsync(variables)).resolves.toBe(false)
    expect(api.postCommentLike).toHaveBeenCalledTimes(1)

    deferred.reject(new Error('Network failure'))
    await expect(firstMutation).rejects.toBeInstanceOf(CommentMutationError)
    expect(queryCache.getQueryData<Comment[]>(key)?.[0]).toBe(original)
    expect(runInTestScope(useCommentsPending).isLikePending(1)).toBe(false)
  })
})

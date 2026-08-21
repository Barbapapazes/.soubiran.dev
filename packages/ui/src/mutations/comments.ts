import type { FetchError } from 'ofetch'
import type { CommentValidationErrorResponse } from '../api/comments'
import type { LocaleCode } from '../locale/type'
import type { Comment } from '../types/comment'
import { defineMutation, useQueryCache } from '@pinia/colada'
import { FetchError as OfetchError } from 'ofetch'
import {
  deleteComment,
  deleteCommentLike,
  postComment,
  postCommentLike,
  putComment,
} from '../api/comments'
import { useCommentsPending } from '../composables/comments/useCommentsPending'
import { COMMENT_QUERY_KEYS } from '../keys/comments'
import { mapCommentResponse } from '../mappers/comments'
import {
  getCommentById,
  patchCommentLike,
  replaceComment,
} from '../utils/comments'

interface CommentMutationTarget {
  pageId: string
  locale: LocaleCode
  commentId: number
  parentCommentId?: number
}

export interface CreateCommentVariables {
  pageId: string
  locale: LocaleCode
  content: string
  parentCommentId?: number
}

export type UpdateCommentVariables = CommentMutationTarget & {
  content: string
}

export type DeleteCommentVariables = CommentMutationTarget

export type ToggleCommentLikeVariables = CommentMutationTarget & {
  shouldLike: boolean
}

export class CommentMutationError extends Error {
  readonly cause: unknown
  readonly contentError: string | undefined

  constructor(cause: unknown, contentError?: string) {
    super(contentError ?? 'The comment operation failed.')
    this.name = 'CommentMutationError'
    this.cause = cause
    this.contentError = contentError
  }
}

function normalizeMutationError(error: unknown) {
  if (error instanceof OfetchError) {
    const fetchError: FetchError<CommentValidationErrorResponse> = error
    return new CommentMutationError(error, fetchError.data?.errors?.content?.[0])
  }

  return new CommentMutationError(error)
}

type QueryCache = ReturnType<typeof useQueryCache>

function updateComments(
  queryCache: QueryCache,
  pageId: string,
  locale: LocaleCode,
  update: (comments: Comment[]) => Comment[],
) {
  const key = COMMENT_QUERY_KEYS.byPageId(pageId, locale)
  const comments = queryCache.getQueryData<Comment[]>(key)
  if (!comments) {
    return
  }

  const updatedComments = update(comments)
  if (updatedComments !== comments) {
    queryCache.setQueryData(key, updatedComments)
  }
}

function invalidateComments(queryCache: QueryCache, pageId: string, locale: LocaleCode) {
  return queryCache.invalidateQueries({
    key: COMMENT_QUERY_KEYS.byPageId(pageId, locale),
    exact: true,
  })
}

export const useDeleteCommentMutation = defineMutation<
  void,
  DeleteCommentVariables,
  CommentMutationError
>({
  async mutation(variables) {
    try {
      await deleteComment(variables.commentId, variables.locale)
    }
    catch (error) {
      throw normalizeMutationError(error)
    }
  },
  onSuccess(_data, variables) {
    void invalidateComments(useQueryCache(), variables.pageId, variables.locale)
  },
})

interface ToggleLikeContext {
  execute: boolean
  ownsPending: boolean
  previousComment: Comment | undefined
}

export const useToggleCommentLikeMutation = defineMutation<
  boolean,
  ToggleCommentLikeVariables,
  CommentMutationError,
  ToggleLikeContext
>({
  async onMutate(variables) {
    const pending = useCommentsPending()
    if (!pending.tryAddPendingLike(variables.commentId)) {
      return {
        execute: false,
        ownsPending: false,
        previousComment: undefined,
      }
    }

    const queryCache = useQueryCache()
    const key = COMMENT_QUERY_KEYS.byPageId(variables.pageId, variables.locale)

    try {
      await queryCache.cancelQueries({ key, exact: true })
    }
    catch (error) {
      pending.removePendingLike(variables.commentId)
      throw normalizeMutationError(error)
    }

    const comments = queryCache.getQueryData<Comment[]>(key)
    const previousComment = comments
      ? getCommentById(comments, variables.commentId, variables.parentCommentId)
      : undefined

    if (!comments || !previousComment) {
      pending.removePendingLike(variables.commentId)
      return {
        execute: false,
        ownsPending: false,
        previousComment: undefined,
      }
    }

    updateComments(
      queryCache,
      variables.pageId,
      variables.locale,
      comments => patchCommentLike(
        comments,
        variables.commentId,
        variables.shouldLike,
        variables.parentCommentId,
      ),
    )

    return {
      execute: true,
      ownsPending: true,
      previousComment,
    }
  },
  async mutation(variables, context) {
    if (!context.execute) {
      return false
    }

    try {
      if (variables.shouldLike) {
        await postCommentLike(variables.commentId, variables.locale)
      }
      else {
        await deleteCommentLike(variables.commentId, variables.locale)
      }

      return true
    }
    catch (error) {
      throw normalizeMutationError(error)
    }
  },
  onError(_error, variables, context) {
    const previousComment = context.previousComment
    if (!context.execute || !previousComment) {
      return
    }

    updateComments(
      useQueryCache(),
      variables.pageId,
      variables.locale,
      comments => replaceComment(comments, previousComment, variables.parentCommentId),
    )
  },
  onSettled(_data, _error, variables, context) {
    if (context.ownsPending) {
      useCommentsPending().removePendingLike(variables.commentId)
    }

    if (context.execute) {
      void invalidateComments(useQueryCache(), variables.pageId, variables.locale)
    }
  },
})

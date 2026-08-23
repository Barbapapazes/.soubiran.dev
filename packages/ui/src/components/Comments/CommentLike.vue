<script lang="ts">
import type { LocaleCode } from '../../locale/type'
import type { Comment } from '../../types/comment'
import { useMutation, useQuery, useQueryCache } from '@pinia/colada'
import { tv } from 'tailwind-variants'
import { computed } from 'vue'
import heartDuotone from '~icons/ph/heart-duotone'
import heartFill from '~icons/ph/heart-fill'
import { deleteCommentLike, postCommentLike } from '../../api/comments'
import { useCommentsContext } from '../../composables/comments/context'
import { useLocale } from '../../composables/useLocale'
import { getLoginErrorMessageKey, useLogin } from '../../composables/useLogin'
import { COMMENT_QUERY_KEYS } from '../../keys/comments'
import { currentUserQuery } from '../../queries/users'

const commentLike = tv({
  slots: {
    base: '',
  },
})

export interface CommentLikeProps {
  parentComment?: Comment
  comment: Comment
  class?: any
  ui?: Partial<typeof commentLike.slots>
}
export interface CommentLikeEmits {}
export interface CommentLikeSlots {}

interface ToggleCommentLikeVariables {
  pageId: string
  locale: LocaleCode
  commentId: number
  parentCommentId?: number
  shouldLike: boolean
}

interface ToggleCommentLikeContext {
  oldComments: Comment[]
  newComments: Comment[]
}

function isToggleCommentLikeContext(context: unknown): context is ToggleCommentLikeContext {
  return typeof context === 'object'
    && context !== null
    && 'oldComments' in context
    && 'newComments' in context
}

function getCachedComment(comments: Comment[], commentId: number, parentCommentId?: number) {
  if (parentCommentId === undefined) {
    return comments.find(comment => comment.id === commentId)
  }

  return comments
    .find(comment => comment.id === parentCommentId)
    ?.replies
    ?.find(comment => comment.id === commentId)
}

function replaceCachedComment(
  comments: Comment[],
  commentId: number,
  nextComment: Comment,
  parentCommentId?: number,
) {
  const replace = (comment: Comment) => {
    if (comment.id !== commentId) {
      return comment
    }

    return nextComment
  }

  if (parentCommentId === undefined) {
    return comments.map(replace)
  }

  return comments.map((comment) => {
    if (comment.id !== parentCommentId || !comment.replies) {
      return comment
    }

    const replies = comment.replies.map(replace)
    return replies.every((reply, index) => reply === comment.replies?.[index])
      ? comment
      : { ...comment, replies }
  })
}
</script>

<script lang="ts" setup>
const props = defineProps<CommentLikeProps>()
defineEmits<CommentLikeEmits>()
defineSlots<CommentLikeSlots>()

const { t } = useLocale()
const toast = useToast()
const queryCache = useQueryCache()
const { banner, locale, pageId } = useCommentsContext()
const { error: loginError, openLoginWindow } = useLogin()
const { data: user } = useQuery(currentUserQuery)

const { mutate: toggleLike } = useMutation({
  onMutate(variables: ToggleCommentLikeVariables): ToggleCommentLikeContext {
    const key = COMMENT_QUERY_KEYS.byPageId(variables.pageId, variables.locale)
    const oldComments = queryCache.getQueryData<Comment[]>(key)!
    const oldComment = getCachedComment(oldComments, variables.commentId, variables.parentCommentId)!
    const newComment: Comment = {
      ...oldComment,
      likes: Math.max(0, oldComment.likes + (variables.shouldLike ? 1 : -1)),
      can: {
        ...oldComment.can,
        like: !variables.shouldLike,
        unlike: variables.shouldLike,
      },
    }
    const newComments = replaceCachedComment(
      oldComments,
      variables.commentId,
      newComment,
      variables.parentCommentId,
    )

    queryCache.setQueryData(key, newComments)
    queryCache.cancelQueries({ key, exact: true })

    return {
      oldComments,
      newComments,
    }
  },
  mutation: variables => variables.shouldLike
    ? postCommentLike(variables.commentId, variables.locale)
    : deleteCommentLike(variables.commentId, variables.locale),
  onError(_error, variables, context) {
    const key = COMMENT_QUERY_KEYS.byPageId(variables.pageId, variables.locale)

    if (isToggleCommentLikeContext(context) && context.newComments === queryCache.getQueryData<Comment[]>(key)) {
      queryCache.setQueryData(key, context.oldComments)
    }

    banner.show({
      kind: 'error',
      message: t(variables.shouldLike ? 'comments.errors.like' : 'comments.errors.unlike'),
    })
  },
  onSettled(_data, _error, variables) {
    queryCache.invalidateQueries({
      key: COMMENT_QUERY_KEYS.byPageId(variables.pageId, variables.locale),
      exact: true,
    })
  },
})

async function onClick() {
  if (!user.value) {
    const isLoggedIn = await openLoginWindow()
    if (!isLoggedIn && loginError.value) {
      toast.add({
        color: 'error',
        description: t(getLoginErrorMessageKey(loginError.value)),
      })
    }
    return
  }

  if (!props.comment.can.like && !props.comment.can.unlike) {
    return
  }

  toggleLike({
    pageId: pageId.value,
    locale: locale.value,
    commentId: props.comment.id,
    parentCommentId: props.parentComment?.id,
    shouldLike: props.comment.can.like,
  })
}

const ui = computed(() => commentLike())
</script>

<template>
  <UButton
    variant="link"
    color="neutral"
    :title="t(props.comment.can.unlike ? 'comments.CommentUnlike.title' : 'comments.CommentLike.title')"
    :label="props.comment.likes.toString()"
    :icon="props.comment.can.unlike ? heartFill : heartDuotone"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
    @click="onClick"
  />
</template>

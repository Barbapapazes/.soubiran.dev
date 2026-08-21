<script lang="ts">
import type { Comment } from '../../types/comment'
import UButton from '@nuxt/ui/components/Button.vue'
import { useQuery } from '@pinia/colada'
import { tv } from 'tailwind-variants'
import { computed } from 'vue'
import heartDuotone from '~icons/ph/heart-duotone'
import heartFill from '~icons/ph/heart-fill'
import { useCommentsContext } from '../../composables/comments/context'
import { useCommentsPending } from '../../composables/comments/useCommentsPending'
import { useLocale } from '../../composables/useLocale'
import { useLogin } from '../../composables/useLogin'
import { useToggleCommentLikeMutation } from '../../mutations/comments'
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
</script>

<script lang="ts" setup>
const props = defineProps<CommentLikeProps>()
defineEmits<CommentLikeEmits>()
defineSlots<CommentLikeSlots>()

const { t } = useLocale()
const { locale, pageId } = useCommentsContext()
const { data: user } = useQuery(currentUserQuery)

const { isLikePending } = useCommentsPending()
const { mutateAsync: toggleCommentLike } = useToggleCommentLikeMutation()
const { navigateToLogin } = useLogin('comments')

async function onClick() {
  if (!user.value) {
    navigateToLogin()
    return
  }

  const shouldLike = props.comment.can.like

  try {
    await toggleCommentLike({
      pageId: pageId.value,
      locale: locale.value,
      commentId: props.comment.id,
      parentCommentId: props.parentComment?.id,
      shouldLike,
    })
  }
  catch {
    banner.show({
      kind: 'error',
      message: t(shouldLike ? 'comments.errors.like' : 'comments.errors.unlike'),
    })
  }
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
    :loading="isLikePending(props.comment.id)"
    :disabled="isLikePending(props.comment.id)"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
    @click="onClick"
  />
</template>

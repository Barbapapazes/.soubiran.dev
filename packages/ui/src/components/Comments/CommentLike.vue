<script lang="ts">
import type { Comment } from '../../types/comment'
import UButton from '@nuxt/ui/components/Button.vue'
import { useOverlay } from '@nuxt/ui/composables/useOverlay'
import { useQuery } from '@pinia/colada'
import { tv } from 'tailwind-variants'
import { computed } from 'vue'
import heartDuotone from '~icons/ph/heart-duotone'
import heartFill from '~icons/ph/heart-fill'
import { useLocale } from '../../composables/useLocale'
import { useLikeComment } from '../../mutations/useLikeComment'
import { useUnlikeComment } from '../../mutations/useUnlikeComment'
import { currentUserQuery } from '../../queries/users'
import LoginModal from '../LoginModal.vue'

const commentLike = tv({
  base: '-mx-3 -my-1.5',
})

export interface CommentLikeProps {
  parentComment?: Comment
  comment: Comment
  class?: any
}
export interface CommentLikeEmits {}
export interface CommentLikeSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<CommentLikeProps>()
defineEmits<CommentLikeEmits>()
defineSlots<CommentLikeSlots>()

const { t } = useLocale()

const { data: user } = useQuery(currentUserQuery)
const { mutate: likeComment } = useLikeComment()
const { mutate: unlikeComment } = useUnlikeComment()
const overlay = useOverlay()
function onLike() {
  if (!user.value) {
    return overlay
      .create(LoginModal, {
        props: {
          fragment: 'comments',
        },
        destroyOnClose: true,
      })
      .open()
  }

  // TODO: fix it (and check the API response)
  // Add a can.like boolean and can.unlike boolean and does not return an array of likes usernames
  if (props.comment.can.unlike) {
    unlikeComment({
      parentCommentId: props.parentComment?.id,
      commentId: props.comment.id,
    })
  }
  else if (props.comment.can.like) {
    likeComment({
      parentCommentId: props.parentComment?.id,
      commentId: props.comment.id,
    })
  }
  else {
    throw new Error('Unexpected like/unlike state')
  }
}

const icon = computed(() => {
  if (props.comment.can.unlike) {
    return heartFill
  }

  if (props.comment.can.like) {
    return heartDuotone
  }

  throw new Error('Unexpected like/unlike state')
})

const title = computed(() => {
  if (props.comment.can.unlike) {
    return t('comments.CommentLike.unlike')
  }

  if (props.comment.can.like) {
    return t('comments.CommentLike.like')
  }

  throw new Error('Unexpected like/unlike state')
})

const ui = computed(() => commentLike({ class: props.class }))
</script>

<template>
  <UButton
    variant="link"
    color="neutral"
    :icon="icon"
    :title="title"
    :label="props.comment.likes.length.toString()"
    :class="ui"
    @click="onLike"
  />
</template>

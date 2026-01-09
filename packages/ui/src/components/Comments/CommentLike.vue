<script lang="ts">
import type { Comment } from '../../types/comment'
import UButton from '@nuxt/ui/components/Button.vue'
import { useOverlay } from '@nuxt/ui/composables/useOverlay'
import { tv } from 'tailwind-variants'
import { computed } from 'vue'
import heartDuotone from '~icons/ph/heart-duotone'
import heartFill from '~icons/ph/heart-fill'
import { useLocale } from '../../composables/useLocale'
import { useLikeComment } from '../../mutations/useLikeComment'
import { useUnlikeComment } from '../../mutations/useUnlikeComment'
import { useUser } from '../../queries/useUser'
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

const { data: user } = useUser()
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
  if (props.comment.likes.includes(user.value.username)) {
    unlikeComment({
      parentCommentId: props.parentComment?.id,
      commentId: props.comment.id,
    })
  }
  else {
    likeComment({
      parentCommentId: props.parentComment?.id,
      commentId: props.comment.id,
    })
  }
}

const ui = computed(() => commentLike({ class: props.class }))
</script>

<template>
  <UButton
    variant="link"
    color="neutral"
    :icon="props.comment.likes.includes(user?.username ?? '') ? heartFill : heartDuotone"
    :title="`${t('comments.CommentLike.likedBy')} ${props.comment.likes.join(', ')}`"
    :label="props.comment.likes.length.toString()"
    :class="ui"
    @click="onLike"
  />
</template>

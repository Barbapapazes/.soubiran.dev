<script lang="ts">
import type { Comment } from '../../types/comment'
import UButton from '@nuxt/ui/components/Button.vue'
import { useOverlay } from '@nuxt/ui/composables/useOverlay'
import { useMutation, useQuery, useQueryCache } from '@pinia/colada'
import { tv } from 'tailwind-variants'
import { computed } from 'vue'
import heartDuotone from '~icons/ph/heart-duotone'
import { postCommentLike } from '../../api/comments'
import { useFrontmatter } from '../../composables/useFrontmatter'
import { useLocale } from '../../composables/useLocale'
import { COMMENT_QUERY_KEY } from '../../queries/comments'
import { currentUserQuery } from '../../queries/users'
import { getCommentById } from '../../utils/comments'
import LoginModal from '../LoginModal.vue'

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

const { frontmatter } = useFrontmatter()
const { t } = useLocale()

const queryCache = useQueryCache()

const { mutate } = useMutation({
  mutation: ({ commentId }: { parentCommentId?: number, commentId: number }) => postCommentLike(commentId),

  onMutate({ parentCommentId, commentId }) {
    const oldComments = queryCache.getQueryData<{ data: Comment[] }>(COMMENT_QUERY_KEY.byPageId(frontmatter.value.id))!

    const newComments = structuredClone(oldComments)

    const comment = getCommentById(
      newComments.data,
      commentId,
      parentCommentId,
    )

    if (comment) {
      comment.likes += 1
      comment.can.like = false
      comment.can.unlike = true
    }

    queryCache.setQueryData(COMMENT_QUERY_KEY.byPageId(frontmatter.value.id), newComments)
    queryCache.cancelQueries({ key: COMMENT_QUERY_KEY.byPageId(frontmatter.value.id) })

    return { oldComments, newComments }
  },

  onError: (_, __, { oldComments, newComments }) => {
    if (newComments === queryCache.getQueryData(COMMENT_QUERY_KEY.byPageId(frontmatter.value.id))) {
      queryCache.setQueryData(COMMENT_QUERY_KEY.byPageId(frontmatter.value.id), oldComments)
    }
  },

  onSettled: () => {
    queryCache.invalidateQueries({ key: COMMENT_QUERY_KEY.byPageId(frontmatter.value.id) })
  },
})

const { data: user } = useQuery(currentUserQuery)
const overlay = useOverlay()
function onClick() {
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

  mutate({
    commentId: props.comment.id,
    parentCommentId: props.parentComment?.id,
  })
}

const ui = computed(() => commentLike())
</script>

<template>
  <UButton
    variant="link"
    color="neutral"
    :title="t('comments.CommentLike.title')"
    :label="props.comment.likes.toString()"
    :icon="heartDuotone"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
    @click="onClick"
  />
</template>

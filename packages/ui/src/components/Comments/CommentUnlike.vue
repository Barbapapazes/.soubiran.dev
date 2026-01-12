<script lang="ts">
import type { Comment } from '../../types/comment'
import UButton from '@nuxt/ui/components/Button.vue'
import { useOverlay } from '@nuxt/ui/composables/useOverlay'
import { useMutation, useQuery, useQueryCache } from '@pinia/colada'
import { tv } from 'tailwind-variants'
import { computed } from 'vue'
import heartFill from '~icons/ph/heart-fill'
import { deleteCommentLike } from '../../api/comments'
import { useFrontmatter } from '../../composables/useFrontmatter'
import { useLocale } from '../../composables/useLocale'
import { COMMENT_QUERY_KEY } from '../../queries/comments'
import { currentUserQuery } from '../../queries/users'
import { getCommentById } from '../../utils/comments'
import LoginModal from '../LoginModal.vue'

const commentUnlike = tv({
  slots: {
    base: '',
  },
})

export interface CommentUnlikeProps {
  parentComment?: Comment
  comment: Comment
  class?: any
  ui?: Partial<typeof commentUnlike.slots>
}
export interface CommentUnlikeEmits {}
export interface CommentUnlikeSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<CommentUnlikeProps>()
defineEmits<CommentUnlikeEmits>()
defineSlots<CommentUnlikeSlots>()

const { frontmatter } = useFrontmatter()
const { t } = useLocale()

const queryCache = useQueryCache()

const { mutate } = useMutation({
  mutation: ({ commentId }: { parentCommentId?: number, commentId: number }) => deleteCommentLike(commentId),

  onMutate({ parentCommentId, commentId }) {
    const oldComments = queryCache.getQueryData<{ data: Comment[] }>(COMMENT_QUERY_KEY.byPageId(frontmatter.value.id))!

    const newComments = structuredClone(oldComments)

    const comment = getCommentById(
      newComments.data,
      commentId,
      parentCommentId,
    )

    if (comment) {
      comment.likes -= 1
      comment.can.like = true
      comment.can.unlike = false
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

const ui = computed(() => commentUnlike())
</script>

<template>
  <UButton
    variant="link"
    color="neutral"
    :title="t('comments.CommentUnlike.title')"
    :label="props.comment.likes.toString()"
    :icon="heartFill"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
    @click="onClick"
  />
</template>

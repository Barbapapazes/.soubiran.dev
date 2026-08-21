<script lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui/components/DropdownMenu.vue'
import type { Comment } from '../../types/comment'
import UAvatar from '@nuxt/ui/components/Avatar.vue'
import UButton from '@nuxt/ui/components/Button.vue'
import UDropdownMenu from '@nuxt/ui/components/DropdownMenu.vue'
import { useOverlay } from '@nuxt/ui/composables/useOverlay'
import { useQuery } from '@pinia/colada'
import { tv } from 'tailwind-variants'
import { computed, ref } from 'vue'
import notePencil from '~icons/ph/note-pencil-duotone'
import trash from '~icons/ph/trash-duotone'
import { useCommentsContext } from '../../composables/comments/context'
import { useLocale } from '../../composables/useLocale'
import { useDeleteCommentMutation } from '../../mutations/comments'
import { currentUserQuery } from '../../queries/users.ts'
import CommentContent from './CommentContent.vue'
import CommentHeader from './CommentHeader.vue'
import CommentLike from './CommentLike.vue'
import CommentRepliesCount from './CommentRepliesCount.vue'
import CommentConfirmDelete from './Overlays/CommentConfirmDelete.vue'

const comment = tv({
  slots: {
    base: 'comment relative before:content-[\'\']',
    wrapper: 'flex items-start justify-between',
    header: 'flex items-center gap-2',
    headerAvatar: '',
    contentWrapper: '',
    contentFooter: 'flex items-center justify-between',
    like: '-mx-3 -my-1.5',
  },
  variants: {
    isReply: {
      true: {
        base: 'space-y-2 px-4 pb-2 pt-4 before:absolute before:bottom-0 before:left-[calc((var(--avatar-size)/2)-1px+1rem)] before:top-0 before:w-[2px] before:bg-border',
        headerAvatar: 'size-[var(--avatar-size)]',
        contentWrapper: 'ml-[calc(var(--avatar-size)+0.5rem)] space-y-2',
      },
      false: {
        base: 'p-4 space-y-4',
        contentWrapper: 'space-y-4',
      },
    },
  },
})

export interface CommentProps {
  parentComment?: Comment
  comment: Comment
  class?: any
  ui?: Partial<typeof comment.slots>
}
export interface CommentEmits {}
export interface CommentSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<CommentProps>()
defineEmits<CommentEmits>()
defineSlots<CommentSlots>()

const { t } = useLocale()
const { pageId, locale } = useCommentsContext()

const { data: user } = useQuery(currentUserQuery)

// TODO: move mutation in this component
const { mutateAsync: deleteComment } = useDeleteCommentMutation()

const viewEditCommentEditor = ref(false)
function onCommentEdited() {
  viewEditCommentEditor.value = false
}

const showActions = computed(() => user.value && (props.comment.can.update || props.comment.can.delete))

const overlay = useOverlay()
const actions = computed(() => {
  const items: DropdownMenuItem[] = []

  if (props.comment.can.update) {
    items.push({
      icon: notePencil,
      label: t('comments.Comment.actions.edit'),
      onSelect: () => {
        viewEditCommentEditor.value = true
      },
    })
  }

  if (props.comment.can.delete) {
    items.push({
      icon: trash,
      label: t('comments.Comment.actions.delete'),
      onSelect: () => {
        overlay.create(CommentConfirmDelete, {
          props: {
            title: t('comments.CommentConfirmDelete.title'),
            description: t('comments.CommentConfirmDelete.description'),
            cancelLabel: t('ConfirmModal.actions.cancel'),
            confirmLabel: t('ConfirmModal.actions.confirm'),
            deleteComment: async () => {
              try {
                await deleteComment({
                  pageId: pageId.value,
                  locale: locale.value,
                  commentId: props.comment.id,
                  parentCommentId: props.parentComment?.id,
                })
                banner.show({
                  kind: 'success',
                  message: t('comments.CommentConfirmDelete.successMessage'),
                })
                return true
              }
              catch {
                banner.show({ kind: 'error', message: t('comments.errors.delete') })
                return false
              }
            },
          },
          destroyOnClose: true,
        })
          .open()
      },
    })
  }

  return items
})

const ui = computed(() => comment({
  isReply: !!props.parentComment,
}))
</script>

<template>
  <article
    :id="props.comment.html_id"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
    :style="{ '--avatar-size': '1.875rem' }"
  >
    <div :class="ui.wrapper({ class: props.ui?.wrapper })">
      <div :class="ui.header({ class: props.ui?.header })">
        <UAvatar
          :src="props.comment.user.avatar"
          :alt="props.comment.user.name"
          :size="props.parentComment ? 'sm' : 'md'"
          class="z-1"
          :class="ui.headerAvatar({ class: props.ui?.headerAvatar })"
        />
        <CommentHeader :comment="props.comment" />
      </div>

      <UDropdownMenu
        v-if="showActions"
        :items="actions"
        :content="{ align: 'end' }"
      >
        <UButton
          icon="i-ph-dots-three-bold"
          variant="link"
          :aria-label="t('comments.Comment.actionMenu')"
        />
      </UDropdownMenu>
    </div>

    <div :class="ui.contentWrapper({ class: props.ui?.contentWrapper })">
      <CommentContent
        v-model:view-editor="viewEditCommentEditor"
        :parent-comment="props.parentComment"
        :comment="props.comment"
        @success="onCommentEdited"
      />

      <div :class="ui.contentFooter({ class: props.ui?.contentFooter })">
        <CommentLike
          v-if="props.comment.can.like || props.comment.can.unlike"
          :id="props.id"
          :parent-comment="props.parentComment"
          :comment="props.comment"
          :class="ui.like({ class: props.ui?.like })"
        />
        <CommentRepliesCount
          v-if="!props.parentComment && props.comment.replies.length" :comment="props.comment"
        />
      </div>
    </div>
  </article>
</template>

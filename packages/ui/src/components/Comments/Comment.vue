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
import { useLocale } from '../../composables/useLocale'
import { currentUserQuery } from '../../queries/users'
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

// Check if we need to focus the comment (when linked to it) (I think yes)
// onMounted(() => {
//   const location = useBrowserLocation()

//   watchEffect(() => {
//     focusTargetComment(location.value.hash)
//   })
// })

const { t } = useLocale()

const viewEditCommentEditor = ref(false)
function onCommentEdited() {
  viewEditCommentEditor.value = false
}

const { data: user } = useQuery(currentUserQuery)
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
            comment: props.comment,
            parentComment: props.parentComment,
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
          :parent-comment="props.parentComment"
          :comment="props.comment"
        />

        <CommentRepliesCount
          v-if="!props.parentComment && props.comment.replies.length" :comment="props.comment"
        />
      </div>
    </div>
  </article>
</template>

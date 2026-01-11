<script lang="ts">
import type { Comment } from '../../types/comment'
import { tv } from 'tailwind-variants'
import { computed } from 'vue'
import { useLocale } from '../../composables/useLocale'

const commentHeader = tv({
  slots: {
    root: 'flex flex-col items-start text-sm',
    wrapper: 'flex items-center gap-2',
    username: 'text-default font-semibold tracking-wide',
    time: 'text-dimmed',
    link: 'text-xs',
  },
})

export interface CommentHeaderProps {
  comment: Comment
  class?: any
  ui?: Partial<typeof commentHeader.slots>
}
export interface CommentHeaderEmits {}
export interface CommentHeaderSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<CommentHeaderProps>()
defineEmits<CommentHeaderEmits>()
defineSlots<CommentHeaderSlots>()

const { t } = useLocale()

const ui = computed(() => commentHeader())
</script>

<template>
  <div :class="ui.root({ class: [props.ui?.root, props.class] })">
    <dl :class="ui.wrapper({ class: props.ui?.wrapper })">
      <dt class="sr-only">
        {{ t('comments.CommentHeader.author') }}
      </dt>
      <dd :class="ui.username({ class: props.ui?.username })">
        {{ props.comment.user.name }}
      </dd>
      <dt class="sr-only">
        {{ t('comments.CommentHeader.publishedAt') }}
      </dt>
      <dd :class="ui.time({ class: props.ui?.time })">
        <!-- TODO: make datetime auto-updatable using VueUse (then, remove the diff_for_humans and formatted properties from the api) -->
        <time :datetime="props.comment.created_at.formatted">
          {{ props.comment.created_at.diff_for_humans }}
        </time>
      </dd>
    </dl>
  </div>
</template>

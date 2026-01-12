<script lang="ts">
import type { Comment } from '../../types/comment'
import { useQuery } from '@pinia/colada'
import { tv } from 'tailwind-variants'
import { computed } from 'vue'
import { useFrontmatter } from '../../composables/useFrontmatter'
import { useLocale } from '../../composables/useLocale'
import { commentsByPageIdQuery } from '../../queries/comments'

const discussionsSectionSubtitle = tv({
  base: '',
})

export interface DiscussionsSectionSubtitleProps {
  class?: any
}
export interface DiscussionsSectionSubtitleEmits {}
export interface DiscussionsSectionSubtitleSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<DiscussionsSectionSubtitleProps>()
defineEmits<DiscussionsSectionSubtitleEmits>()
defineSlots<DiscussionsSectionSubtitleSlots>()

const { t } = useLocale()
const { frontmatter } = useFrontmatter()
const { data: comments } = useQuery(commentsByPageIdQuery, () => ({ id: frontmatter.value.id }))

const commentsSubtitle = computed(() => {
  const count = comments.value?.data.length ?? 0

  if (count > 1) {
    return t('discussions.DiscussionsSectionSubtitle.comments.plural', { count: count.toString() })
  }

  return t('discussions.DiscussionsSectionSubtitle.comments.singular', { count: count.toString() })
})
const repliesSubtitle = computed(() => {
  const count = comments.value?.data.reduce((acc: number, comment: Comment) => acc + comment.replies.length, 0) ?? 0

  if (count > 1) {
    return t('discussions.DiscussionsSectionSubtitle.replies.plural', { count: count.toString() })
  }

  return t('discussions.DiscussionsSectionSubtitle.replies.singular', { count: count.toString() })
})

const ui = computed(() => discussionsSectionSubtitle({ class: props.class }))
</script>

<template>
  <Subtitle :class="ui">
    {{ commentsSubtitle }} · {{ repliesSubtitle }}
  </Subtitle>
</template>

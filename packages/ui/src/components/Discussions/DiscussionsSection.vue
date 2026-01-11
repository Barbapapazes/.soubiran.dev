<script lang="ts">
import { useQuery } from '@pinia/colada'
import { tv } from 'tailwind-variants'
import { computed } from 'vue'
import { useFrontmatter } from '../../composables/useFrontmatter'
import { useLocale } from '../../composables/useLocale'
import { commentsByPageIdQuery } from '../../queries/comments'
import CommentFormSection from '../Comments/CommentFormSection.vue'
import DiscussionsList from './DiscussionsList.vue'
import DiscussionsSectionSubtitle from './DiscussionsSectionSubtitle.vue'

const discussionsSection = tv({
  slots: {
    base: '',
    header: 'mb-6',
  },
})

export interface DiscussionsSectionProps {
  class?: any
  ui?: Partial<typeof discussionsSection.slots>
}
export interface DiscussionsSectionEmits {}
export interface DiscussionsSectionSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<DiscussionsSectionProps>()
defineEmits<DiscussionsSectionEmits>()
defineSlots<DiscussionsSectionSlots>()

const { t } = useLocale()
const { frontmatter } = useFrontmatter()
const { state: commentsState } = useQuery(commentsByPageIdQuery, () => ({ id: frontmatter.value.id }))

const ui = computed(() => discussionsSection())
</script>

<template>
  <section id="comments">
    <div :class="ui.base({ class: [props.class, props.ui?.header] })">
      <div :class="ui.header({ class: props.ui?.header })">
        <!-- TODO: component -->
        <DiscussionsSectionTitle />
        <ClientOnly>
          <DiscussionsSectionSubtitle />
        </ClientOnly>
      </div>

      <ClientOnly>
        <!-- TODO: components -->
        <LoadingData v-if="commentsState.status === 'pending'" />
        <LoadingError v-else-if="commentsState.status === 'error'" />

        <!-- TODO: component -->
        <NoData
          v-else-if="!commentsState.data?.data.length"
          :text="t('discussions.DiscussionsSection.empty')"
        />

        <DiscussionsList v-else />
      </ClientOnly>

      <CommentFormSection class="mt-12" />
    </div>
  </section>
</template>

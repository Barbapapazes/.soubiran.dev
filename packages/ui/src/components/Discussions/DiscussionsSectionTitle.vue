<script lang="ts">
import { tv } from 'tailwind-variants'
import { computed } from 'vue'
import { useLocale } from '../../composables/useLocale'
import SectionTitle from '../Section/SectionTitle.vue'

const discussionsSectionTitle = tv({
  slots: {
    base: '',
  },
})

export interface DiscussionsSectionTitleProps {
  class?: any
  ui?: Partial<typeof discussionsSectionTitle.slots>
}
export interface DiscussionsSectionTitleEmits {}
export interface DiscussionsSectionTitleSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<DiscussionsSectionTitleProps>()
defineEmits<DiscussionsSectionTitleEmits>()
defineSlots<DiscussionsSectionTitleSlots>()

const { t } = useLocale()

const ui = computed(() => discussionsSectionTitle())
</script>

<template>
  <SectionTitle :class="ui.base({ class: [props.ui?.base, props.class] })">
    {{ t('discussions.DiscussionsSectionTitle.title') }}
  </SectionTitle>
</template>

<script lang="ts">
import UButton from '@nuxt/ui/components/Button.vue'
import UPopover from '@nuxt/ui/components/Popover.vue'
import { tv } from 'tailwind-variants'
import { computed, ref } from 'vue'
import thumbsUp from '~icons/ph/thumbs-up'
import useUmami from '../composables/useUmami'
import FeedbackCard from './FeedbackCard.vue'

const feedback = tv({
  slots: {
    base: 'px-0 py-1 text-dimmed text-sm',
  },
})

export interface FeedbackProps {
  id: string
  class?: any
  ui?: Partial<typeof feedback.slots>
}
export interface FeedbackEmits {}
export interface FeedbackSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<FeedbackProps>()
defineEmits<FeedbackEmits>()
defineSlots<FeedbackSlots>()

const { track } = useUmami()
function onClick() {
  track('feedback_click')
}

const content = ref('')
const rating = ref('')

function onSuccess() {
  content.value = ''
  rating.value = ''
}

const ui = computed(() => feedback())
</script>

<template>
  <UPopover :ui="{ content: 'ring-0 data-[state=open]:animate-[scale-up_100ms_ease-out]' }">
    <UButton
      variant="link"
      color="neutral"
      label="Give feedback"
      size="sm"
      :icon="thumbsUp"
      :class="ui.base({ class: [props.ui?.base, props.class] })"
      @click="onClick"
    />

    <template #content>
      <FeedbackCard
        :id="props.id"
        v-model:rating="rating"
        v-model:content="content"
        @success="onSuccess"
      />
    </template>
  </UPopover>
</template>

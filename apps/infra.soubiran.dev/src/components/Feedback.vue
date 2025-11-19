<script lang="ts">
import thumbsUp from '~icons/ph/thumbs-up'

const feedback = tv({
  slots: {
    base: '',
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
    <UButton variant="link" color="neutral" size="sm" label="Give feedback" :icon="thumbsUp" :class="ui.base({ class: [props.ui?.base, props.class] })" class="p-0" />

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

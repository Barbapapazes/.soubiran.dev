<script lang="ts">
import { useMutation } from '@pinia/colada'
import { motion } from 'motion-v'
import { ofetch } from 'ofetch'
import { RadioGroupIndicator, RadioGroupItem, RadioGroupRoot } from 'reka-ui'
import checkCircle from '~icons/ph/check-circle'

const feedbackCard = tv({
  slots: {
    base: 'relative w-64',
    successfullySentOverlay: 'absolute z-10 inset-0 bg-default',
    successfullySentContent: 'absolute z-20 inset-0 flex flex-col justify-center items-center text-muted text-xs',
    successfullySentIcon: 'size-5',
    input: 'w-full',
    radioGroup: 'flex flex-row gap-2 text-lg',
    radioGroupItem: 'peer',
    radioGroupLabel: 'grayscale-100 hover:grayscale-0 peer-data-[state=checked]:grayscale-0',
  },
})

export interface FeedbackCardProps {
  id: string
  class?: any
  ui?: Partial<typeof feedbackCard.slots>
}
export interface FeedbackCardEmits {
  success: [void]
}
export interface FeedbackCardSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<FeedbackCardProps>()
const emits = defineEmits<FeedbackCardEmits>()
defineSlots<FeedbackCardSlots>()

const content = defineModel<string>('content', { required: true })
const rating = defineModel<string>('rating', { required: true })

const ratings = [
  {
    label: '😭',
    value: 'Hate it',
  },
  {
    label: '🙁',
    value: 'Not great',
  },
  {
    label: '🙂',
    value: 'It\'s ok',
  },
  {
    label: '🤩',
    value: 'Love it',
  },
]

const successfullySent = ref(false)

const { mutate, isLoading, error } = useMutation<
  void,
  { rating: string, content: string },
  { status: number, data: { errors?: { content?: string[], rating?: string[] } } }
>({
  mutation: ({ rating, content }) => ofetch(`/api/posts/${props.id}/feedback`, {
    method: 'POST',
    body: { rating, content },
    baseURL: import.meta.env.VITE_API_BASE_URL,
  }),
  onSuccess: () => {
    successfullySent.value = true

    // Wait for the animation to finish
    setTimeout(() => emits('success'), 200)
  },
})

function sendFeedback() {
  mutate({ rating: rating.value, content: content.value })
}

const formattedError = computed<string | undefined>(() => {
  if (!error.value)
    return undefined

  if (error.value.data?.errors) {
    return error.value.data.errors.content?.[0] || error.value.data.errors.rating?.[0]
  }

  if (error.value.status === 404)
    return 'Page not found. Cannot send feedback. It\'s us, not you!'

  if (error.value.status === 503)
    return 'Service is currently unavailable. Please try again later.'

  return 'An unexpected error occurred.'
})

const ui = computed(() => feedbackCard())
</script>

<template>
  <UCard :class="ui.base({ class: [props.ui?.base, props.class] })" :ui="{ body: 'p-2 sm:p-2', footer: 'p-2 sm:p-2 flex items-center justify-between' }">
    <template v-if="successfullySent">
      <motion.div
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1, transition: { duration: 0.2 } }"
        :class="ui.successfullySentOverlay({ class: props.ui?.successfullySentOverlay })"
      />
      <div :class="ui.successfullySentContent({ class: props.ui?.successfullySentContent })">
        <motion.div
          :initial="{ opacity: 0, transform: 'translateY(4px)' }"
          :animate="{ opacity: 1, transform: 'translateY(0)', transition: { delay: 0.1, duration: 0.3 } }"
        >
          <UIcon :name="checkCircle" :class="ui.successfullySentIcon({ class: props.ui?.successfullySentIcon })" />
        </motion.div>
        <motion.p
          :initial="{ opacity: 0, transform: 'translateY(4px)' }"
          :animate="{ opacity: 1, transform: 'translateY(0)', transition: { delay: 0.2, duration: 0.3 } }"
          class="mt-3"
        >
          Your feedback has been received.
        </motion.p>
        <motion.p
          :initial="{ opacity: 0, transform: 'translateY(4px)' }"
          :animate="{ opacity: 1, transform: 'translateY(0)', transition: { delay: 0.3, duration: 0.3 } }"
          class="mt-1"
        >
          Thanks for your help!
        </motion.p>
      </div>
    </template>

    <UFormField :error="formattedError">
      <UTextarea v-model="content" placeholder="Your feedback..." variant="soft" :class="ui.input({ class: props.ui?.input })" />
      <template #error="{ error: formFieldError }">
        <motion.div
          v-if="formFieldError"
          :initial="{ height: 0 }"
          :animate="{ height: 'auto' }"
          class="text-sm"
        >
          {{ formFieldError }}
        </motion.div>
      </template>
    </UFormField>
    <template #footer>
      <RadioGroupRoot v-model="rating" :class="ui.radioGroup({ class: props.ui?.radioGroup })">
        <div v-for="item in ratings" :key="item.value">
          <RadioGroupItem :id="item.value" :value="item.value" :class="ui.radioGroupItem({ class: props.ui?.radioGroupItem })">
            <RadioGroupIndicator />
          </RadioGroupItem>
          <label :for="item.value" :class="ui.radioGroupLabel({ class: props.ui?.radioGroupLabel })">{{ item.label }}</label>
        </div>
      </RadioGroupRoot>
      <UButton size="sm" label="Send" :loading="isLoading" @click="sendFeedback" />
    </template>
  </UCard>
</template>

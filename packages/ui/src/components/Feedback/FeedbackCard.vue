<script lang="ts">
import type { FetchError } from 'ofetch'
import type { FeedbackValidationErrorResponse } from '../../api/feedback'
import UButton from '@nuxt/ui/components/Button.vue'
import UCard from '@nuxt/ui/components/Card.vue'
import UFormField from '@nuxt/ui/components/FormField.vue'
import UIcon from '@nuxt/ui/components/Icon.vue'
import UTextarea from '@nuxt/ui/components/Textarea.vue'
import UTooltip from '@nuxt/ui/components/Tooltip.vue'
import { useMutation } from '@pinia/colada'
import { motion } from 'motion-v'
import { RadioGroupIndicator, RadioGroupItem, RadioGroupRoot } from 'reka-ui'
import { tv } from 'tailwind-variants'
import { computed, ref } from 'vue'
import checkCircle from '~icons/ph/check-circle'
import { postFeedback } from '../../api/feedback'
import { useLocale } from '../../composables/useLocale'
import useUmami from '../../composables/useUmami'

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
    title: 'FeedbackCard.ratings.hate',
  },
  {
    label: '🙁',
    value: 'Not great',
    title: 'FeedbackCard.ratings.poor',
  },
  {
    label: '🙂',
    value: 'It\'s ok',
    title: 'FeedbackCard.ratings.okay',
  },
  {
    label: '🤩',
    value: 'Love it',
    title: 'FeedbackCard.ratings.love',
  },
] as const

const successfullySent = ref(false)

const { t } = useLocale()
const { track } = useUmami()
const { mutate, isLoading, error } = useMutation<
  void,
  { rating: string, content: string },
  FetchError<FeedbackValidationErrorResponse>
>({
  mutation: ({ rating, content }) => postFeedback(props.id, rating, content),
  onSuccess: () => {
    successfullySent.value = true

    track('feedback_submit')

    // Wait for the animation to finish
    setTimeout(emits, 200, 'success')
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
    return t('FeedbackCard.errors.notFound')

  if (error.value.status === 503)
    return t('FeedbackCard.errors.unavailable')

  return t('FeedbackCard.errors.unexpected')
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
          {{ t('FeedbackCard.success.received') }}
        </motion.p>
        <motion.p
          :initial="{ opacity: 0, transform: 'translateY(4px)' }"
          :animate="{ opacity: 1, transform: 'translateY(0)', transition: { delay: 0.3, duration: 0.3 } }"
          class="mt-1"
        >
          {{ t('FeedbackCard.success.thanks') }}
        </motion.p>
      </div>
    </template>

    <UFormField :error="formattedError">
      <UTextarea v-model="content" :placeholder="t('FeedbackCard.placeholder')" variant="soft" :class="ui.input({ class: props.ui?.input })" />
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
          <UTooltip :text="t(item.title)">
            <label :for="item.value" :class="ui.radioGroupLabel({ class: props.ui?.radioGroupLabel })">{{ item.label }}</label>
          </UTooltip>
        </div>
      </RadioGroupRoot>
      <UButton size="sm" :label="t('FeedbackCard.action')" :loading="isLoading" @click="sendFeedback" />
    </template>
  </UCard>
</template>

<script lang="ts">
import UButton from '@nuxt/ui/components/Button.vue'
import { tv } from 'tailwind-variants'
import { computed, toRef } from 'vue'
import { useLocale } from '../composables/useLocale'
import { useLogin } from '../composables/useLogin'

const loginRequired = tv({
  slots: {
    base: 'flex flex-col gap-4 items-center',
    prose: 'text-sm',
    actions: 'flex flex-row items-center justify-center gap-2',
  },
})

export interface LoginRequiredProps {
  fragment?: string
  class?: any
  ui?: Partial<typeof loginRequired.slots>
}
export interface LoginRequiredEmits {}
export interface LoginRequiredSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<LoginRequiredProps>()
defineEmits<LoginRequiredEmits>()
defineSlots<LoginRequiredSlots>()

const { t } = useLocale()
const { loginLink } = useLogin(toRef(() => props.fragment))

const ui = computed(() => loginRequired())
</script>

<template>
  <div :class="ui.base({ class: [props.ui?.base, props.class] })">
    <!-- TODO: what to we do with the prose component? -->
    <Prose
      :class="ui.prose({ class: props.ui?.prose })" without-bottom-margin
    >
      <p>
        {{ t('LoginRequired.text') }}
      </p>
    </Prose>

    <div :class="ui.actions({ class: props.ui?.actions })">
      <UButton
        color="neutral"
        variant="solid"
        :label="t('LoginRequired.action')"
        :href="loginLink"
      />
    </div>
  </div>
</template>

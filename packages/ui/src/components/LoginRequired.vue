<script lang="ts">
import UButton from '@nuxt/ui/components/Button.vue'
import { useToast } from '@nuxt/ui/composables/useToast'
import { tv } from 'tailwind-variants'
import { computed } from 'vue'
import { useLocale } from '../composables/useLocale'
import { getLoginErrorMessageKey, useLogin } from '../composables/useLogin'

const loginRequired = tv({
  slots: {
    base: 'flex flex-col gap-4 items-center',
    prose: 'text-sm',
    actions: 'flex flex-row items-center justify-center gap-2',
  },
})

export interface LoginRequiredProps {
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
const toast = useToast()
const { error, isPending, openLoginWindow } = useLogin()

async function login() {
  const isLoggedIn = await openLoginWindow()
  if (!isLoggedIn && error.value) {
    toast.add({
      color: 'error',
      description: t(getLoginErrorMessageKey(error.value)),
    })
  }
}

const ui = computed(() => loginRequired())
</script>

<template>
  <div :class="ui.base({ class: [props.ui?.base, props.class] })">
    <p
      :class="ui.prose({ class: props.ui?.prose })"
    >
      {{ t('LoginRequired.text') }}
    </p>

    <div :class="ui.actions({ class: props.ui?.actions })">
      <UButton
        color="neutral"
        variant="solid"
        :label="t('LoginRequired.action')"
        :loading="isPending"
        :disabled="isPending"
        @click="login"
      />
    </div>
  </div>
</template>

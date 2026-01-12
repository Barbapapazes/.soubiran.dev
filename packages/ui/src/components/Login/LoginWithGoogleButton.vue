<script lang="ts">
import UButton from '@nuxt/ui/components/Button.vue'
import { tv } from 'tailwind-variants'
import { computed } from 'vue'
import googleIcon from '~icons/simple-icons/google'
import { useLocale } from '../../composables/useLocale'
import { useLogin } from '../../composables/useLogin'

const loginWithGoogleButton = tv({
  slots: {
    base: '',
  },
})

export interface LoginWithGoogleButtonProps {
  class?: any
  ui?: Partial<typeof loginWithGoogleButton.slots>
}
export interface LoginWithGoogleButtonEmits {}
export interface LoginWithGoogleButtonSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<LoginWithGoogleButtonProps>()
defineEmits<LoginWithGoogleButtonEmits>()
defineSlots<LoginWithGoogleButtonSlots>()

const { t } = useLocale()
const { googleLink } = useLogin()

const ui = computed(() => loginWithGoogleButton())
</script>

<template>
  <UButton
    color="neutral"
    variant="solid"
    :label="t('login.LoginWithGoogleButton.label')"
    :href="googleLink"
    :icon="googleIcon"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
  />
</template>

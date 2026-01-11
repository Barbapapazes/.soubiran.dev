<script lang="ts">
import UModal from '@nuxt/ui/components/Modal.vue'
import { tv } from 'tailwind-variants'
import { computed } from 'vue'
import { useLocale } from '../composables/useLocale'
import LoginWithGitHubButton from './Login/LoginWithGitHubButton.vue'
import LoginWithGoogleButton from './Login/LoginWithGoogleButton.vue'

const loginModal = tv({
  slots: {
    base: '',
  },
})

export interface LoginModalProps {
  fragment?: string
  class?: any
  ui?: Partial<typeof loginModal.slots>
}
export interface LoginModalEmits {
  close: [void]
}
export interface LoginModalSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<LoginModalProps>()
defineEmits<LoginModalEmits>()
defineSlots<LoginModalSlots>()

const { t } = useLocale()

const ui = computed(() => loginModal())
</script>

<template>
  <UModal
    :title="t('LoginModal.title')"
    :description="t('LoginModal.description')"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
    :ui="{ content: 'space-y-4', footer: 'flex flex-row items-center justify-end gap-2' }"
  >
    <template #footer>
      <LoginWithGitHubButton />
      <LoginWithGoogleButton />
    </template>
  </UModal>
</template>

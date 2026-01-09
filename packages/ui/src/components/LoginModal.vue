<script lang="ts">
import UButton from '@nuxt/ui/components/Button.vue'
import UModal from '@nuxt/ui/components/Modal.vue'
import { tv } from 'tailwind-variants'
import { computed } from 'vue'
import githubIcon from '~icons/simple-icons/github'
import googleIcon from '~icons/simple-icons/google'
import { useLocale } from '../composables/useLocale'
import { useLogin } from '../composables/useLogin'

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

const { githubLink, googleLink } = useLogin(() => props.fragment)

const ui = computed(() => loginModal())
</script>

<template>
  <UModal
    :title="t('LoginModal.title')"
    :description="t('LoginModal.description')"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
    :ui="{ content: 'space-y-4', footer: 'flex flex-row justify-end gap-2' }"
  >
    <template #footer>
      <UButton
        color="neutral"
        variant="solid"
        :label="t('LoginModal.github')"
        :href="githubLink"
        :icon="githubIcon"
      />
      <UButton
        color="neutral"
        variant="solid"
        :label="t('LoginModal.google')"
        :href="googleLink"
        :icon="googleIcon"
      />
    </template>
  </UModal>
</template>

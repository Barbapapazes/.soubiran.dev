<script lang="ts">
import UButton from '@nuxt/ui/components/Button.vue'
import { tv } from 'tailwind-variants'
import { computed } from 'vue'
import githubIcon from '~icons/simple-icons/github'
import { useLocale } from '../../composables/useLocale'
import { useLogin } from '../../composables/useLogin'

const loginWithGitHubButton = tv({
  slots: {
    base: '',
  },
})

export interface LoginWithGitHubButtonProps {
  class?: any
  ui?: Partial<typeof loginWithGitHubButton.slots>
}
export interface LoginWithGitHubButtonEmits {}
export interface LoginWithGitHubButtonSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<LoginWithGitHubButtonProps>()
defineEmits<LoginWithGitHubButtonEmits>()
defineSlots<LoginWithGitHubButtonSlots>()

const { t } = useLocale()
const { githubLink } = useLogin()

const ui = computed(() => loginWithGitHubButton())
</script>

<template>
  <UButton
    color="neutral"
    variant="solid"
    :label="t('login.LoginWithGitHubButton.label')"
    :href="githubLink"
    :icon="githubIcon"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
  />
</template>

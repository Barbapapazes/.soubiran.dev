import type { AlertProps } from '@nuxt/ui'
import { createSharedComposable } from '@vueuse/core'
import { computed, readonly, ref } from 'vue'

function _useDiscussionsAlert() {
  const message = ref<string>()
  const color = ref<AlertProps['color']>()

  function show(msg: string, type: AlertProps['color'] = 'neutral') {
    message.value = msg
    color.value = type

    // Auto-hide the alert after 5 seconds
    setTimeout(() => {
      message.value = undefined
      color.value = undefined
    }, 5_000)
  }

  return {
    isActive: computed(() => !!message.value),
    message: readonly(message),
    color: readonly(color),
    show,
  }
}

export const useDiscussionsAlert = createSharedComposable(_useDiscussionsAlert)

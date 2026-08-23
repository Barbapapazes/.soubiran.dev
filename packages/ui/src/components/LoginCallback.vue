<script lang="ts">
import { onMounted, ref } from 'vue'
import { useLocale } from '../composables/useLocale'
import {
  LOGIN_CALLBACK_MESSAGE_TYPE,
  LOGIN_CALLBACK_NONCE_PARAM,
} from '../utils/login'

export interface LoginCallbackProps {
  class?: any
}
export interface LoginCallbackEmits {}
export interface LoginCallbackSlots {
  success: (props: { message: string }) => any
  error: (props: { message: string }) => any
}
</script>

<script lang="ts" setup>
const props = defineProps<LoginCallbackProps>()
defineEmits<LoginCallbackEmits>()
defineSlots<LoginCallbackSlots>()

const { t } = useLocale()
const status = ref<'pending' | 'success' | 'error'>('pending')

onMounted(() => {
  const nonce = new URL(window.location.href).searchParams.get(LOGIN_CALLBACK_NONCE_PARAM)

  if (!nonce || !window.opener || window.opener.closed) {
    status.value = 'error'
    return
  }

  try {
    window.opener.postMessage(
      {
        type: LOGIN_CALLBACK_MESSAGE_TYPE,
        nonce,
      },
      window.location.origin,
    )
    status.value = 'success'
    window.close()
  }
  catch {
    status.value = 'error'
  }
})
</script>

<template>
  <div :class="props.class">
    <slot
      v-if="status === 'error'"
      name="error"
      :message="t('LoginCallback.error')"
    >
      <p>{{ t('LoginCallback.error') }}</p>
    </slot>

    <slot
      v-else
      name="success"
      :message="t('LoginCallback.success')"
    >
      <p>{{ t('LoginCallback.success') }}</p>
    </slot>
  </div>
</template>

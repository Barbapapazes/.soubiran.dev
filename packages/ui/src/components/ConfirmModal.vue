<script lang="ts">
import { tv } from 'tailwind-variants'
import { computed } from 'vue'
import { useLocale } from '../composables/useLocale'

const confirmModal = tv({
  slots: {
    base: '',
  },
})

export interface ConfirmModalProps {
  title: string
  description: string
  cancelLabel?: string
  confirmLabel?: string
  loading?: boolean
  class?: any
  ui?: Partial<typeof confirmModal.slots>

}
export interface ConfirmModalEmits {
  confirm: [void]
  close: [void]
}
export interface ConfirmModalSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<ConfirmModalProps>()
const emit = defineEmits<ConfirmModalEmits>()
defineSlots<ConfirmModalSlots>()

const { t } = useLocale()

function onClose() {
  emit('close')
}

function onConfirm() {
  emit('confirm')
}

const ui = computed(() => confirmModal())
</script>

<template>
  <UModal
    :title="title"
    :description="description"
    :ui="{
      content: 'space-y-4',
      footer: 'justify-end',
    }"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
  >
    <template #footer>
      <UButton
        :label="props.cancelLabel ?? t('ConfirmModal.actions.cancel')"
        variant="ghost"
        color="neutral"
        @click="onClose"
      />
      <UButton
        :label="props.confirmLabel ?? t('ConfirmModal.actions.confirm')"
        variant="solid"
        color="neutral"
        :loading="props.loading"
        @click="onConfirm()"
      />
    </template>
  </UModal>
</template>

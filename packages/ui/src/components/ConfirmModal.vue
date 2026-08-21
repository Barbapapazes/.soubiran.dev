<script lang="ts">
import UButton from '@nuxt/ui/components/Button.vue'
import UModal from '@nuxt/ui/components/Modal.vue'
import { tv } from 'tailwind-variants'
import { computed } from 'vue'

const confirmModal = tv({
  slots: {
    base: '',
  },
})

export interface ConfirmModalProps {
  title: string
  description: string
  cancelLabel: string
  confirmLabel: string
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
    :ui="{ content: 'space-y-4', footer: 'justify-end' }"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
  >
    <template #footer>
      <UButton
        :label="props.cancelLabel"
        variant="ghost"
        color="neutral"
        @click="onClose"
      />
      <UButton
        :label="props.confirmLabel"
        variant="solid"
        color="neutral"
        :loading="props.loading"
        @click="onConfirm()"
      />
    </template>
  </UModal>
</template>

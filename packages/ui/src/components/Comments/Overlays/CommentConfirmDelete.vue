<script lang="ts">
import { tv } from 'tailwind-variants'
import { computed, ref } from 'vue'
import ConfirmModal from '../../ConfirmModal.vue'

const confirmDeleteCommentModal = tv({
  slots: {
    base: '',
  },
})

export interface ConfirmDeleteCommentModalProps {
  title: string
  description: string
  cancelLabel: string
  confirmLabel: string
  deleteComment: () => Promise<boolean>
  class?: any
  ui?: Partial<typeof confirmDeleteCommentModal.slots>
}
export interface ConfirmDeleteCommentModalEmits {
  close: [void]
}
export interface ConfirmDeleteCommentModalSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<ConfirmDeleteCommentModalProps>()
const emit = defineEmits<ConfirmDeleteCommentModalEmits>()
defineSlots<ConfirmDeleteCommentModalSlots>()

const isLoading = ref(false)

function onClose() {
  emit('close')
}

async function onConfirm() {
  if (isLoading.value) {
    return
  }

  isLoading.value = true
  const deleted = await props.deleteComment()
  isLoading.value = false

  if (deleted) {
    emit('close')
  }
}

const ui = computed(() => confirmDeleteCommentModal())
</script>

<template>
  <ConfirmModal
    :title="props.title"
    :description="props.description"
    :cancel-label="props.cancelLabel"
    :confirm-label="props.confirmLabel"
    :loading="isLoading"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
    @close="onClose"
    @confirm="onConfirm"
  />
</template>

<script lang="ts">
import { tv } from 'tailwind-variants'
import { computed } from 'vue'

const form = tv({
  slots: {
    base: 'space-y-4',
    wrapper: 'space-y-4',
    actions: 'flex items-center justify-end gap-2',
  },
})

export interface FormProps {
  class?: any
  ui?: Partial<typeof form.slots>
}
export interface FormEmits {
  submit: [Event]
}
export interface FormSlots {
  default: (props: object) => any
  actions: (props: object) => any
}
</script>

<script lang="ts" setup>
const props = defineProps<FormProps>()
const emit = defineEmits<FormEmits>()
defineSlots<FormSlots>()

function onSubmit(event: Event) {
  emit('submit', event)
}

const ui = computed(() => form())
</script>

<template>
  <form :class="ui.base({ class: [props.ui?.base, props.class] })" @submit.prevent="onSubmit">
    <div :class="ui.wrapper({ class: props.ui?.wrapper })">
      <slot />
    </div>

    <div :class="ui.actions({ class: props.ui?.actions })">
      <slot name="actions" />
    </div>
  </form>
</template>

<script lang="ts">
import { tv } from 'tailwind-variants'
import { computed } from 'vue'

const container = tv({
  slots: {
    base: 'px-4 sm:px-6 lg:px-8',
    inner: 'w-full max-w-7xl mx-auto',
  },
})

export interface ContainerProps {
  class?: any
  ui?: Partial<typeof container.slots>
}
export interface ContainerEmits {}
export interface ContainerSlots {
  default: (props: any) => any
}
</script>

<script lang="ts" setup>
const props = defineProps<ContainerProps>()
defineEmits<ContainerEmits>()
defineSlots<ContainerSlots>()

const ui = computed(() => container())
</script>

<template>
  <div :class="ui.base({ class: [props.ui?.base, props.class] })">
    <div :class="ui.inner({ class: props.ui?.inner })">
      <slot />
    </div>
  </div>
</template>

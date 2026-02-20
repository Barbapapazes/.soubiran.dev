<script lang="ts">
import { tv } from 'tailwind-variants'
import { computed } from 'vue'

const sectionTitle = tv({
  slots: {
    base: 'text-lg font-semibold text-default',
  },
})

export interface SectionTitleProps {
  class?: any
  ui?: Partial<typeof sectionTitle.slots>
}
export interface SectionTitleEmits {}
export interface SectionTitleSlots {
  default: () => any
}
</script>

<script lang="ts" setup>
const props = defineProps<SectionTitleProps>()
defineEmits<SectionTitleEmits>()
defineSlots<SectionTitleSlots>()

const ui = computed(() => sectionTitle())
</script>

<template>
  <h2 :class="ui.base({ class: [props.ui?.base, props.class] })">
    <slot />
  </h2>
</template>

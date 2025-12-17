<script lang="ts">
import { tv } from 'tailwind-variants'
import { computed } from 'vue'

const pageHeader = tv({
  slots: {
    base: '',
  },
})

export interface PageHeaderProps {
  title: string
  class?: any
  ui?: Partial<typeof pageHeader.slots>
}
export interface PageHeaderEmits {}
export interface PageHeaderSlots {
  after: (props: any) => any
}
</script>

<script lang="ts" setup>
const props = defineProps<PageHeaderProps>()
defineEmits<PageHeaderEmits>()
defineSlots<PageHeaderSlots>()

const ui = computed(() => pageHeader())
</script>

<template>
  <div :class="ui.base({ class: [props.ui?.base, props.class] })">
    <PageTitle :title="props.title" />
    <slot name="after" />
  </div>
</template>

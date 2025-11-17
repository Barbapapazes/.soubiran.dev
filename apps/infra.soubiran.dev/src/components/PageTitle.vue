<script lang="ts">
const pageTitle = tv({
  slots: {
    base: 'text-xl font-bold text-highlighted',
  },
})

export interface PageTitleProps {
  title: string
  class?: any
  ui?: Partial<typeof pageTitle.slots>
}
export interface PageTitleEmits {}
export interface PageTitleSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<PageTitleProps>()
defineEmits<PageTitleEmits>()
defineSlots<PageTitleSlots>()

const ui = computed(() => pageTitle())
</script>

<template>
  <h1 :class="ui.base({ class: [props.ui?.base, props.class] })">
    {{ title }}
  </h1>
</template>

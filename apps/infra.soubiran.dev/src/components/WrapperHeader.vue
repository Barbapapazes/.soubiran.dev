<script lang="ts">
const wrapperHeader = tv({
  slots: {
    base: '',
  },
})

interface Repository {
  url: string
  private?: boolean
}

export interface WrapperHeaderProps {
  title: string
  url?: string
  repository?: string | Repository
  class?: any
  ui?: Partial<typeof wrapperHeader.slots>
}
export interface WrapperHeaderEmits {}
export interface WrapperHeaderSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<WrapperHeaderProps>()
defineEmits<WrapperHeaderEmits>()
defineSlots<WrapperHeaderSlots>()

const ui = computed(() => wrapperHeader())
</script>

<template>
  <div :class="ui.base({ class: [props.ui?.base, props.class] })">
    <WrapperTitle :title="props.title" />
    <WrapperLinks :url="props.url" :repository="props.repository" />
  </div>
</template>

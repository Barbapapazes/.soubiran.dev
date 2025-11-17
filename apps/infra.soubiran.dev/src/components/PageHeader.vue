<script lang="ts">
const pageHeader = tv({
  slots: {
    base: '',
  },
})

interface Repository {
  url: string
  private?: boolean
}

export interface PageHeaderProps {
  title: string
  url?: string
  repository?: string | Repository
  class?: any
  ui?: Partial<typeof pageHeader.slots>
}
export interface PageHeaderEmits {}
export interface PageHeaderSlots {}
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
    <PageLinks :url="props.url" :repository="props.repository" />
  </div>
</template>

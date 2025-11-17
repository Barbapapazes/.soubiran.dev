<script lang="ts">
interface Repository {
  url: string
  private?: boolean
}

export interface WrapperHeaderProps {
  title: string
  url?: string
  repository?: string | Repository
  class?: any
}
export interface WrapperHeaderEmits {}
export interface WrapperHeaderSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<WrapperHeaderProps>()
defineEmits<WrapperHeaderEmits>()
defineSlots<WrapperHeaderSlots>()
</script>

<template>
  <div :class="props.class">
    <WrapperTitle :title="props.title" />
    <WrapperLinks :url="props.url" :repository="props.repository" />
  </div>
</template>

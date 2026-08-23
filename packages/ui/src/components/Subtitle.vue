<script lang="ts">
import { tv } from 'tailwind-variants'
import { computed } from 'vue'

const subtitle = tv({
  base: 'text-sm text-dimmed',
})

export interface SubtitleProps {
  text?: string
  class?: any
}
export interface SubtitleEmits {}
export interface SubtitleSlots {
  default: (props: object) => any
}
</script>

<script lang="ts" setup>
const props = defineProps<SubtitleProps>()
defineEmits<SubtitleEmits>()
defineSlots<SubtitleSlots>()

const ui = computed(() => subtitle({ class: props.class }))
</script>

<template>
  <p :class="ui">
    <slot>
      {{ props.text }}
    </slot>
  </p>
</template>

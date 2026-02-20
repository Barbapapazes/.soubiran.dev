<script lang="ts">
import { tv } from 'tailwind-variants'
import { computed } from 'vue'
import { useLocale } from '../../composables/useLocale'

const statePending = tv({
  slots: {
    base: '',
  },
})

export interface StatePendingProps {
  class?: any
  ui?: Partial<typeof statePending.slots>
}
export interface StatePendingEmits {}
export interface StatePendingSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<StatePendingProps>()
defineEmits<StatePendingEmits>()
defineSlots<StatePendingSlots>()

const { t } = useLocale()

const ui = computed(() => statePending())
</script>

<template>
  <p :class="ui.base({ class: [props.ui?.base, props.class] })">
    {{ t('state.pending') }}
  </p>
</template>

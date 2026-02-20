<script lang="ts">
import { tv } from 'tailwind-variants'
import { computed } from 'vue'
import { useLocale } from '../../composables/useLocale'

const stateEmpty = tv({
  slots: {
    base: '',
  },
})

export interface StateEmptyProps {
  class?: any
  ui?: Partial<typeof stateEmpty.slots>
}
export interface StateEmptyEmits {}
export interface StateEmptySlots {}
</script>

<script lang="ts" setup>
const props = defineProps<StateEmptyProps>()
defineEmits<StateEmptyEmits>()
defineSlots<StateEmptySlots>()

const { t } = useLocale()

const ui = computed(() => stateEmpty())
</script>

<template>
  <p :class="ui.base({ class: [props.ui?.base, props.class] })">
    {{ t('state.empty') }}
  </p>
</template>

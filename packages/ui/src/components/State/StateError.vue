<script lang="ts">
import { tv } from 'tailwind-variants'
import { computed } from 'vue'
import { useLocale } from '../../composables/useLocale'

const stateError = tv({
  slots: {
    base: '',
  },
})

export interface StateErrorProps {
  class?: any
  ui?: Partial<typeof stateError.slots>
}
export interface StateErrorEmits {}
export interface StateErrorSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<StateErrorProps>()
defineEmits<StateErrorEmits>()
defineSlots<StateErrorSlots>()

const { t } = useLocale()

const ui = computed(() => stateError())
</script>

<template>
  <p :class="ui.base({ class: [props.ui?.base, props.class] })">
    {{ t('state.error') }}
  </p>
</template>

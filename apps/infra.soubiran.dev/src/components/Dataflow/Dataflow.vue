<script lang="ts">
import type { Edge, Node } from '@vue-flow/core'
import type { Dataflow } from '@/types/dataflow'
import { Background } from '@vue-flow/background'
import { useVueFlow, VueFlow } from '@vue-flow/core'

const dataflow = tv({
  slots: {
    root: 'relative w-full h-50 bg-white dark:bg-black rounded-lg',
    base: '',
  },
})

export interface DataflowProps {
  steps: Dataflow
  class?: any
  ui?: Partial<typeof dataflow.slots>
}
export interface DataflowEmits {}
export interface DataflowSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<DataflowProps>()
defineEmits<DataflowEmits>()
defineSlots<DataflowSlots>()

const { fitView } = useVueFlow()

const nodes = ref<Node[]>(
  props.steps.map(step => ({
    id: step.id,
    type: 'dataflow',
    position: { x: 0, y: 0 },
    data: step,
  })),
)

// Create edges connecting each step
const edges = ref<Edge[]>(
  props.steps.slice(0, -1).map((step, index) => {
    const nextStep = props.steps[index + 1]!
    return {
      id: `${step.id}-${nextStep.id}`,
      source: step.id,
      target: nextStep.id,
      animated: true,
    }
  }),
)

const { layout } = useLayout()
onMounted(() => {
  nextTick(() => {
    nodes.value = layout(nodes.value, edges.value, 'LR')
    fitView({ minZoom: 1 })
  })
})

const ui = computed(() => dataflow({ class: props.class, ...props.ui }))
</script>

<template>
  <div :class="ui.root({ class: props.ui?.root })">
    <VueFlow
      fit-view-on-init
      :default-viewport="{ zoom: 1 }"
      :nodes-draggable="false"
      :min-zoom="0.5"
      :max-zoom="1"
      :nodes="nodes"
      :edges="edges"
      :class="ui.base({ class: [props.ui?.base, props.class] })"
    >
      <template #node-dataflow="nodeProps">
        <DataflowNode v-bind="nodeProps" />
      </template>

      <Background />
    </VueFlow>
  </div>
</template>

<style scoped>
@import '@vue-flow/core/dist/style.css';

.vue-flow__edge-path {
  stroke: var(--ui-border-muted);
}
</style>

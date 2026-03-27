<script lang="ts">
import type { Edge, Node } from '@vue-flow/core'
import type { Dataflow, DataflowStep } from '@/types/dataflow'

const dataflow = tv({
  slots: {
    root: 'h-50 rounded-lg',
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

function buildGraph(steps: DataflowStep[], parentStepId?: string): {
  nodes: Node<DataflowStep>[]
  edges: Edge[]
} {
  const nodes: Node<DataflowStep>[] = []
  const edges: Edge[] = []

  for (const [index, step] of steps.entries()) {
    nodes.push({
      id: step.id,
      type: 'dataflow',
      position: { x: 0, y: 0 },
      data: step,
    })

    if (parentStepId) {
      edges.push({
        id: `${parentStepId}-${step.id}`,
        source: parentStepId,
        target: step.id,
        animated: true,
      })
    }
    else {
      const nextStep = steps[index + 1]
      if (nextStep) {
        edges.push({
          id: `${step.id}-${nextStep.id}`,
          source: step.id,
          target: nextStep.id,
          animated: true,
        })
      }
    }

    if (step.children?.length) {
      const childGraph = buildGraph(step.children, step.id)
      nodes.push(...childGraph.nodes)
      edges.push(...childGraph.edges)
    }
  }

  return { nodes, edges }
}

const graph = computed(() => buildGraph(props.steps))
const nodes = computed(() => graph.value.nodes)
const edges = computed(() => graph.value.edges)

const ui = computed(() => dataflow({ class: props.class, ...props.ui }))
</script>

<template>
  <BaseFlow
    direction="LR"
    :nodes="nodes"
    :edges="edges"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
    :ui="{ root: ui.root({ class: props.ui?.root }) }"
  >
    <template #node-dataflow="nodeProps">
      <DataflowNode v-bind="nodeProps" />
    </template>
  </BaseFlow>
</template>

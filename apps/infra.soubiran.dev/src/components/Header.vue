<script lang="ts">
import circlesFour from '~icons/ph/circles-four-duotone'
import graph from '~icons/ph/graph-duotone'
import house from '~icons/ph/house-duotone'
import squaresFour from '~icons/ph/squares-four-duotone'

const header = tv({
  slots: {
    base: 'h-(--ui-header-height) flex flex-row gap-4 items-center justify-end',
    link: 'p-0 text-dimmed',
  },
})

export interface HeaderProps {
  class?: any
  ui?: Partial<typeof header.slots>
}
export interface HeaderEmits {}
export interface HeaderSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<HeaderProps>()
defineEmits<HeaderEmits>()
defineSlots<HeaderSlots>()

const { track } = useUmami()
function trackClick(label: string) {
  track('header_click', { label })
}

const ui = computed(() => header())
</script>

<template>
  <Container :ui="{ inner: 'max-w-5xl' }">
    <header :class="ui.base({ class: [props.ui?.base, props.class] })">
      <UTooltip text="Home">
        <UButton
          to="/"
          variant="link"
          color="neutral"
          aria-label="Home"
          :icon="house"
          :class="ui.link({ class: props.ui?.link })"
          @click="trackClick('Home')"
        />
      </UTooltip>
      <UTooltip text="Websites">
        <UButton
          to="/websites"
          variant="link"
          color="neutral"
          aria-label="Websites"
          :icon="squaresFour"
          :class="ui.link({ class: props.ui?.link })"
          @click="trackClick('Websites')"
        />
      </UTooltip>
      <UTooltip text="Platforms">
        <UButton
          to="/platforms"
          variant="link"
          color="neutral"
          aria-label="Platforms"
          :icon="circlesFour"
          :class="ui.link({ class: props.ui?.link })"
          @click="trackClick('Platforms')"
        />
      </UTooltip>
      <UTooltip text="Ecosystem">
        <UButton
          to="/ecosystem"
          variant="link"
          color="neutral"
          aria-label="Ecosystem"
          :icon="graph"
          :class="ui.link({ class: props.ui?.link })"
          @click="trackClick('Ecosystem')"
        />
      </UTooltip>
    </header>
  </Container>
</template>

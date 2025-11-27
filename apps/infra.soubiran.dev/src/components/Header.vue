<script lang="ts">
import circlesFour from '~icons/ph/circles-four-duotone'
import graph from '~icons/ph/graph-duotone'
import house from '~icons/ph/house-duotone'
import squaresFour from '~icons/ph/squares-four-duotone'
import discord from '~icons/simple-icons/discord'
import github from '~icons/simple-icons/github'
import linkedin from '~icons/simple-icons/linkedin'
import twitch from '~icons/simple-icons/twitch'
import x from '~icons/simple-icons/x'

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
      <USeparator orientation="vertical" class="h-5" />
      <UTooltip text="GitHub">
        <UButton
          href="https://github.com/barbapapazes"
          target="_blank"
          variant="link"
          color="neutral"
          aria-label="GitHub"
          :icon="github"
          :class="ui.link({ class: props.ui?.link })"
          :ui="{ leadingIcon: 'size-4' }"
          @click="trackClick('GitHub')"
        />
      </UTooltip>
      <UTooltip text="LinkedIn">
        <UButton
          href="https://www.linkedin.com/in/esteban25/"
          target="_blank"
          variant="link"
          color="neutral"
          aria-label="LinkedIn"
          :icon="linkedin"
          :class="ui.link({ class: props.ui?.link })"
          :ui="{ leadingIcon: 'size-4' }"
          @click="trackClick('LinkedIn')"
        />
      </UTooltip>
      <UTooltip text="X">
        <UButton
          href="https://x.com/soubiran_"
          target="_blank"
          variant="link"
          color="neutral"
          aria-label="X"
          :icon="x"
          :class="ui.link({ class: props.ui?.link })"
          :ui="{ leadingIcon: 'size-4' }"
          @click="trackClick('X')"
        />
      </UTooltip>
      <UTooltip text="Twitch">
        <UButton
          href="https://www.twitch.tv/barbapapazes"
          target="_blank"
          variant="link"
          color="neutral"
          aria-label="Twitch"
          :icon="twitch"
          :class="ui.link({ class: props.ui?.link })"
          :ui="{ leadingIcon: 'size-4' }"
          @click="trackClick('Twitch')"
        />
      </UTooltip>
      <UTooltip text="Discord">
        <UButton
          href="https://discord.gg/q2ghCGUuFR"
          target="_blank"
          variant="link"
          color="neutral"
          aria-label="Discord"
          :icon="discord"
          :class="ui.link({ class: props.ui?.link })"
          :ui="{ leadingIcon: 'size-4' }"
          @click="trackClick('Discord')"
        />
      </UTooltip>
    </header>
  </Container>
</template>

<script lang="ts" setup>
import type { EcosystemItem } from '@/types/ecosystem'
import circlesFour from '~icons/ph/circles-four-duotone'
import graph from '~icons/ph/graph-duotone'
import house from '~icons/ph/house-duotone'
import squaresFour from '~icons/ph/squares-four-duotone'
import Ecosystem from '@/components/Ecosystem/Ecosystem.vue'

const router = useRouter()
const ecosystem = router.getRoutes()
  .filter(route => (route.path.startsWith('/websites/') || route.path.startsWith('/platforms/')) && route.meta.frontmatter.ecosystem)
  .map(route => ({
    type: route.path.startsWith('/websites/') ? 'website' : 'platform',
    name: route.meta.frontmatter.title,
    ecosystem: route.meta.frontmatter.ecosystem!,
  } satisfies EcosystemItem))
</script>

<template>
  <div class="relative w-screen h-screen">
    <Ecosystem
      name="Estéban's Infra"
      :ecosystem="ecosystem"
      :ui="{ root: 'w-full h-full' }"
    />
    <header class="fixed top-4 right-4 z-10 flex flex-row gap-4 items-center bg-white bg-opacity-90 shadow-sm backdrop-blur-sm dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-2">
      <UTooltip text="Home">
        <UButton
          to="/"
          variant="link"
          color="neutral"
          aria-label="Home"
          :icon="house"
          class="p-0 text-dimmed"
        />
      </UTooltip>
      <UTooltip text="Websites">
        <UButton
          to="/websites"
          variant="link"
          color="neutral"
          aria-label="Websites"
          :icon="squaresFour"
          class="p-0 text-dimmed"
        />
      </UTooltip>
      <UTooltip text="Platforms">
        <UButton
          to="/platforms"
          variant="link"
          color="neutral"
          aria-label="Platforms"
          :icon="circlesFour"
          class="p-0 text-dimmed"
        />
      </UTooltip>
      <UTooltip text="Ecosystem">
        <UButton
          to="/ecosystem"
          variant="link"
          color="neutral"
          aria-label="Ecosystem"
          :icon="graph"
          class="p-0 text-dimmed"
        />
      </UTooltip>
    </header>
  </div>
</template>

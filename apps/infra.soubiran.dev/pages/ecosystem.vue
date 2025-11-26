<script lang="ts">
import type { EcosystemItem } from '@/types/ecosystem'
import { motion } from 'motion-v'
import circlesFour from '~icons/ph/circles-four-duotone'
import graph from '~icons/ph/graph-duotone'
import house from '~icons/ph/house-duotone'
import squaresFour from '~icons/ph/squares-four-duotone'
import Ecosystem from '@/components/Ecosystem/Ecosystem.vue'

const ecosystemTV = tv({
  slots: {
    base: '',
    link: 'p-0 text-dimmed',
  },
})
</script>

<script lang="ts" setup>
const route = useRoute()
function track(label: string) {
  window.umami?.track('ecosystem_header_click', {
    page_path: route.path,
    label,
  })
}

const router = useRouter()
const ecosystem = router.getRoutes()
  .filter(route => (route.path.startsWith('/websites/') || route.path.startsWith('/platforms/')) && route.meta.frontmatter.ecosystem)
  .map(route => ({
    type: route.path.startsWith('/websites/') ? 'website' : 'platform',
    name: route.meta.frontmatter.title,
    ecosystem: route.meta.frontmatter.ecosystem!,
  } satisfies EcosystemItem))

const ui = computed(() => ecosystemTV())
</script>

<template>
  <div class="relative w-screen h-screen">
    <Ecosystem
      name="Estéban's Infra"
      :ecosystem="ecosystem"
      :ui="{ root: 'w-full h-full' }"
    />
    <motion.header
      :initial="{ opacity: 0 }"
      :animate="{ opacity: 1, transition: { delay: 0.2, duration: 0.4 } }"
      class="fixed top-4 right-4 z-10 flex flex-row gap-4 items-center bg-white bg-opacity-90 shadow-sm backdrop-blur-sm dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-2"
    >
      <UTooltip text="Home">
        <UButton
          to="/"
          variant="link"
          color="neutral"
          aria-label="Home"
          :icon="house"
          :class="ui.link()"
          @click="track('Home')"
        />
      </UTooltip>
      <UTooltip text="Websites">
        <UButton
          to="/websites"
          variant="link"
          color="neutral"
          aria-label="Websites"
          :icon="squaresFour"
          :class="ui.link()"
          @click="track('Websites')"
        />
      </UTooltip>
      <UTooltip text="Platforms">
        <UButton
          to="/platforms"
          variant="link"
          color="neutral"
          aria-label="Platforms"
          :icon="circlesFour"
          :class="ui.link()"
          @click="track('Platforms')"
        />
      </UTooltip>
      <UTooltip text="Ecosystem">
        <UButton
          to="/ecosystem"
          variant="link"
          color="neutral"
          aria-label="Ecosystem"
          :icon="graph"
          :class="ui.link()"
          @click="track('Ecosystem')"
        />
      </UTooltip>
    </motion.header>
  </div>
</template>

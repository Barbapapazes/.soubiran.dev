<script lang="ts" setup>
import type { TableOfContentsItem } from '../../../../packages/ui/src/components/TableOfContents.vue'
import { useHead } from '@unhead/vue'
import { motion } from 'motion-v'

const props = defineProps<{
  frontmatter: {
    id: string
    title: string
    toc: TableOfContentsItem[]
    page: string
  }
}>()

const isContentPage = computed(() => props.frontmatter.page.endsWith('show'))

useHead({
  titleTemplate: '%s · Estéban Soubiran',
})
</script>

<template>
  <Page>
    <template #header>
      <PageHeader
        :title="props.frontmatter.title"
      />
    </template>

    <slot />

    <template v-if="isContentPage" #right>
      <motion.div
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1, transition: { delay: 0.4, duration: 0.4 } }"
      >
        <TableOfContents :toc="props.frontmatter.toc" />

        <USeparator class="my-2" />

        <Feedback :id="props.frontmatter.id" />
      </motion.div>
    </template>
  </Page>
</template>

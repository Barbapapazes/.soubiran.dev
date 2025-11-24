<script lang="ts" setup>
import type { TableOfContentsItem } from '@/components/TableOfContents.vue'
import type { Ecosystem } from '@/types/ecosystem'
import { useHead } from '@unhead/vue'

interface Repository {
  url: string
  private?: boolean
}

const props = defineProps<{
  frontmatter: {
    id: string
    title: string
    url?: string
    repository?: string | Repository
    ecosystem?: Ecosystem
    page: string
    toc: TableOfContentsItem[]
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
        :url="props.frontmatter.url"
        :repository="props.frontmatter.repository"
      />
    </template>

    <slot />

    <template v-if="isContentPage" #right>
      <TableOfContents :toc="props.frontmatter.toc" />

      <USeparator class="my-2" />

      <Feedback :id="props.frontmatter.id" />
    </template>

    <template #bottom>
      <Ecosystem
        v-if="frontmatter.ecosystem"
        inline
        class="mt-12"
        :name="frontmatter.title"
        :ecosystem="frontmatter.ecosystem"
        :ui="{ root: 'w-full h-160' }"
      />
    </template>
  </Page>
</template>

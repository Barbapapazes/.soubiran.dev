<script lang="ts" setup>
import type { Ecosystem } from '@/types/ecosystem'
import { useHead } from '@unhead/vue'

interface Repository {
  url: string
  private?: boolean
}

interface TableOfContentsItem {
  level: number
  anchor: string | null
  text: string
  children: TableOfContentsItem[]
}

const props = defineProps<{
  frontmatter: {
    id: string
    title: string
    url?: string
    repository?: string | Repository
    ecosystem?: Ecosystem
    page: string
    toc: TableOfContentsItem
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
      <ul>
        <li v-for="(item, index) in props.frontmatter.toc.children" :key="item.anchor || index">
          <a
            v-if="item.anchor"
            :key="item.anchor"
            :href="`#${item.anchor}`"
          >
            {{ item.text }}
          </a>
        </li>
      </ul>

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

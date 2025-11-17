<script lang="ts" setup>
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
  }
}>()

useHead({
  titleTemplate: '%s · Estéban Soubiran',
})
</script>

<template>
  <Page>
    <template #header>
      <WrapperHeader
        :title="props.frontmatter.title"
        :url="props.frontmatter.url"
        :repository="props.frontmatter.repository"
      />
    </template>

    <slot />

    <template #right>
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

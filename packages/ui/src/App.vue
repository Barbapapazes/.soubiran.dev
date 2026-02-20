<script lang="ts" setup>
import UApp from '@nuxt/ui/components/App.vue'
import { PiniaColadaDevtools } from '@pinia/colada-devtools'
import App from './components/App.vue'
import DiscussionsSection from './components/Discussions/DiscussionsSection.vue'
</script>

<template>
  <App>
    <UApp>
      <DiscussionsSection
        id="eb77373d-1d0f-42c2-8714-6e7e05c3ad11"
      />
    </UApp>
  </App>

  <PiniaColadaDevtools />
</template>

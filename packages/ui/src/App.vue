<script lang="ts" setup>
import UApp from '@nuxt/ui/components/App.vue'
import { PiniaColadaDevtools } from '@pinia/colada-devtools'
import App from './components/App.vue'
import Comments from './components/Comments.vue'
</script>

<template>
  <App>
    <UApp>
      <Comments
        page-id="f339abd4-daf8-4e1b-8388-ea0f912f50c9"
        locale="en"
      />

      <PiniaColadaDevtools />
    </UApp>
  </App>
</template>

<script lang="ts" setup>
import UApp from '@nuxt/ui/components/App.vue'
import UContainer from '@nuxt/ui/components/Container.vue'
import App from './components/App.vue'
import Comments from './components/Comments.vue'
</script>

<template>
  <App>
    <UApp>
      <UContainer>
        <Comments
          page-id="f339abd4-daf8-4e1b-8388-ea0f912f50c9"
          locale="en"
        />

        <RouterView />
      </UContainer>
    </UApp>
  </App>
</template>

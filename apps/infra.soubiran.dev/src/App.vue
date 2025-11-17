<script lang="ts" setup>
const route = useRoute()
</script>

<template>
  <UApp>
    <Header v-if="route.meta.frontmatter.page !== 'ecosystem'" />

    <UMain>
      <RouterView />
    </UMain>

    <ViewersCounter class="fixed bottom-4 right-4 z-10 bg-white bg-opacity-90 shadow-sm backdrop-blur-sm dark:bg-neutral-900" />
  </UApp>
</template>

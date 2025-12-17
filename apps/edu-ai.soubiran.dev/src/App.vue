<script lang="ts" setup>
import { motion } from 'motion-v'
import house from '~icons/ph/house-duotone'

const links = [
  {
    icon: house,
    label: 'Home',
    to: '/',
  },
]
</script>

<template>
  <UApp>
    <motion.div
      :initial="{ opacity: 0 }"
      :animate="{ opacity: 1, transition: { delay: 0.8, duration: 0.6 } }"
    >
      <Header :links="links" />
    </motion.div>

    <UMain>
      <RouterView />
    </UMain>

    <ViewersCounter class="fixed bottom-4 right-4 z-10 bg-white bg-opacity-90 shadow-sm backdrop-blur-sm dark:bg-neutral-900" />
  </UApp>
</template>

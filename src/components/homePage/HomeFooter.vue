<script setup lang="ts">
import HomeLink from '@/components/homePage/HomeLink.vue'
import { HeartIcon } from 'lucide-vue-next'
</script>

<template>
  <footer class="p-6 flex justify-end mb-12">
    <p class="text-lg font-medium leading-8 text-muted-foreground">
      Made with <HeartIcon class="mx-1 size-5 inline text-red-500" /> by
      <HomeLink href="https://maiker.de">My_Maker</HomeLink>
    </p>
  </footer>
</template>

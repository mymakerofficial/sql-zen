<script setup lang="ts">
import HeroText from '@/components/homePage/HeroText.vue'
import { LazyHeroConsole } from '@/components/homePage/lazyHeroConsole'
import { useMediaQuery } from '@vueuse/core'

const smallScreen = useMediaQuery('(max-width: 1024px)')
</script>

<template>
  <section
    class="p-6 md:p-0 sm:w-2/3 lg:w-full lg:grid lg:grid-cols-8 lg:gap-12 lg:h-[70vh]"
  >
    <HeroText class="col-span-4 xl:col-span-3" />
    <LazyHeroConsole v-if="!smallScreen" class="col-span-4 xl:col-span-5" />
  </section>
</template>

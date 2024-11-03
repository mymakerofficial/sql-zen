<script setup lang="ts">
import HeroText from '@/components/homePage/HeroText.vue'
import { LazyHeroConsole } from '@/components/homePage/lazyHeroConsole'
</script>

<template>
  <section
    class="p-6 md:p-0 flex flex-col xl:grid xl:grid-cols-8 gap-20 mg:gap-12"
  >
    <HeroText class="col-span-3 mt-6 md:w-2/3 xl:w-full" />
    <LazyHeroConsole class="col-span-5 h-[50vh] xl:h-[70vh] xl:max-h-[620px]" />
  </section>
</template>

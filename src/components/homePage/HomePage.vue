<script setup lang="ts">
import HeroSection from '@/components/homePage/HeroSection.vue'
import HowItWorks from '@/components/homePage/HowItWorks.vue'
import SupportedDatabases from '@/components/homePage/SupportedDatabases.vue'
import HighlightsSection from '@/components/homePage/HighlightsSection.vue'
import { Separator } from '@/components/ui/separator'
import HomeFooter from '@/components/homePage/HomeFooter.vue'
</script>

<template>
  <div
    class="flex flex-col gap-20 md:gap-32 md:px-16 md:pt-[10vh] lg:px-28 mx-auto max-w-[2024px]"
  >
    <HeroSection />
    <div class="flex flex-col gap-20 md:gap-32 mx-auto w-full max-w-[1200px]">
      <SupportedDatabases />
      <Separator class="w-8 mx-auto" />
      <HighlightsSection />
      <HowItWorks class="mt-12" />
    </div>
    <HomeFooter />
  </div>
</template>

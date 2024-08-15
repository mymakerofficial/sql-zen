<script setup lang="ts">
import HeroSection from '@/components/homePage/HeroSection.vue'
import HowItWorks from '@/components/homePage/HowItWorks.vue'
import SupportedDatabases from '@/components/homePage/SupportedDatabases.vue'
import HighlightsSection from '@/components/homePage/HighlightsSection.vue'
import HomeFooter from '@/components/homePage/HomeFooter.vue'
</script>

<template>
  <div
    class="flex flex-col gap-20 md:gap-32 md:px-16 md:pt-[10vh] lg:px-28 mx-auto max-w-[2024px]"
  >
    <HeroSection />
    <SupportedDatabases />
    <HighlightsSection />
    <HowItWorks />
    <HomeFooter />
  </div>
</template>

<script setup lang="ts">
import HeroSection from '@/components/homePage/HeroSection.vue'
import HowItWorks from '@/components/homePage/HowItWorks.vue'
import SupportedDatabases from '@/components/homePage/SupportedDatabases.vue'
import HighlightsSection from '@/components/homePage/HighlightsSection.vue'
import HomeFooter from '@/components/homePage/HomeFooter.vue'
import HomePageHeader from '@/components/homePage/HomePageHeader.vue'
import Container from '@/components/homePage/Container.vue'
</script>

<template>
  <HomePageHeader />
  <Container as-child>
    <main class="flex flex-col gap-20 md:gap-32 md:pt-[10vh]">
      <HeroSection />
      <SupportedDatabases />
      <HighlightsSection />
      <HowItWorks />
      <HomeFooter />
    </main>
  </Container>
</template>

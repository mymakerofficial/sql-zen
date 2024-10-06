<script setup lang="ts">
import HomePage from '@/components/homePage/HomePage.vue'
import HomePageHeader from '@/components/shared/appHeader/HomePageHeader.vue'
</script>

<template>
  <div vaul-drawer-wrapper class="bg-background h-screen flex flex-col">
    <HomePageHeader />
    <main class="flex-1 overflow-auto">
      <HomePage />
    </main>
  </div>
</template>

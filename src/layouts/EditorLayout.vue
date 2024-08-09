<script setup lang="ts">
import AppHeader from '@/components/shared/appHeader/AppHeader.vue'
</script>

<template>
  <div class="h-screen flex flex-col">
    <AppHeader :active-data-source="null">
      <slot name="header" />
    </AppHeader>
    <slot />
  </div>
</template>

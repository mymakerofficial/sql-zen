<script setup lang="ts">
import AppHeader from '@/components/shared/AppHeader.vue'
</script>

<template>
  <div class="h-screen flex flex-col">
    <AppHeader>
      <slot name="header" />
    </AppHeader>
    <slot />
  </div>
</template>

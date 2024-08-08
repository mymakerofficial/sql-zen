<script setup lang="ts">
import AppHeader from '@/components/shared/appHeader/AppHeader.vue'

const activeDataSource = defineModel<string | null>('activeDataSource', {
  required: true,
  default: null,
})
</script>

<template>
  <div class="h-screen flex flex-col">
    <AppHeader v-model:active-data-source="activeDataSource">
      <slot name="header" />
    </AppHeader>
    <slot />
  </div>
</template>

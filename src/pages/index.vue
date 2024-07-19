<script setup lang="ts">
import { ref } from 'vue'
import AppHeader from '@/components/AppHeader.vue'

const selectedDatabase = ref<string>('sqlite')
</script>

<template>
  <div class="h-screen flex flex-col">
    <AppHeader v-model:database="selectedDatabase" />
    <main class="flex-1 flex items-center justify-center">
      <p class="text-muted-foreground">Please select a database.</p>
    </main>
  </div>
</template>
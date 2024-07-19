<script setup lang="ts">
import DatabaseSelect from '@/components/DatabaseSelect.vue'

const database = defineModel<string>('database', { default: 'postgresql' })
</script>

<template>
  <nav class="relative h-16 px-3 flex items-center border-b border-border">
    <span class="w-96 h-full absolute left-0 -z-10 bg-gradient-to-r from-blue-500/20 to-blue-500/0" />
    <DatabaseSelect v-model="database" />
  </nav>
</template>

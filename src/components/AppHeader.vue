<script setup lang="ts">
import DatabaseSelect from '@/components/databaseSelect/DatabaseSelect.vue'
import { computed } from 'vue'
import { twMerge } from 'tailwind-merge'
import { useDatabaseSystem } from '@/composables/useDatabaseSystem'
import ColorModeSelect from '@/components/ColorModeSelect.vue'

const database = useDatabaseSystem()

const gradientClass = computed(() => {
  if (database.value === 'postgresql') {
    return 'from-blue-500/20 to-blue-500/0'
  } else if (database.value === 'sqlite') {
    return 'from-sky-500/20 to-sky-500/0'
  } else if (database.value === 'duckdb') {
    return 'from-yellow-500/20 to-yellow-500/0'
  }
  return ''
})
</script>

<template>
  <nav class="relative h-16 px-3 flex justify-between border-b border-border">
    <div class="h-full flex items-center">
      <span
        :class="
          twMerge(
            'w-96 h-full absolute left-0 -z-10 bg-gradient-to-r',
            gradientClass,
          )
        "
      />
      <DatabaseSelect />
    </div>
    <div class="h-full flex items-center">
      <ColorModeSelect />
    </div>
  </nav>
</template>

<script setup lang="ts">
import type { DatabaseSystemInfo } from '@/lib/databaseSystems'

defineProps<DatabaseSystemInfo>()
</script>

<template>
  <div class="my-1 flex flex-col gap-2 max-w-80">
    <div class="flex items-center gap-2">
      <img :src="icon" :alt="`${name} Icon`" class="size-6" />
      <span>{{ name }}</span>
    </div>
    <p class="pl-8 pr-2 text-xs text-muted-foreground" data-description>
      {{ description }}
    </p>
  </div>
</template>

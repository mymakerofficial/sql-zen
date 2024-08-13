<script setup lang="ts">
import type { DatabaseEngineInfo } from '@/lib/engines/interface'

defineProps<DatabaseEngineInfo>()
</script>

<template>
  <div class="my-1 flex flex-col gap-2 max-w-80">
    <div class="flex items-center gap-3">
      <img :src="icon" :alt="`${name} Icon`" class="size-6 min-h-max" />
      <span>{{ name }}</span>
    </div>
    <p class="pl-9 pr-2 text-xs text-muted-foreground" data-description>
      {{ description }}
    </p>
  </div>
</template>

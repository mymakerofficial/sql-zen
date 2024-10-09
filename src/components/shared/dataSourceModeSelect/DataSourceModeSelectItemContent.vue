<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  icon: Component
  name: string
  description: string
}>()
</script>

<template>
  <div class="my-1 flex flex-col gap-2 max-w-80">
    <div class="flex items-center gap-3">
      <component :is="icon" class="size-4" />
      <span>{{ name }}</span>
    </div>
    <p class="pl-7 pr-2 text-xs text-muted-foreground" data-description>
      {{ description }}
    </p>
  </div>
</template>

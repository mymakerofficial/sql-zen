<script setup lang="ts">
import { ListVideoIcon, PlusIcon } from 'lucide-vue-next'
</script>

<template>
  <section class="h-12 flex items-center border-b border-border">
    <div
      class="h-full px-6 text-muted-foreground flex gap-3 items-center border-r border-border">
      <ListVideoIcon class="size-4" />
      <span>console</span>
    </div>
    <div
      class="h-full px-6 text-muted-foreground flex gap-3 items-center border-r border-border">
      <ListVideoIcon class="size-4" />
      <span>console 2</span>
    </div>
    <div
      class="h-full aspect-square text-muted-foreground flex items-center justify-center">
      <PlusIcon class="size-4" />
    </div>
  </section>
</template>

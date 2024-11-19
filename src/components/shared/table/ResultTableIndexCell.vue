<script setup lang="ts">
defineProps<{
  index: number
  offset: number
}>()
</script>

<template>
  <span
    class="text-muted-foreground"
  >
    {{ index + offset + 1 }}
  </span>
</template>

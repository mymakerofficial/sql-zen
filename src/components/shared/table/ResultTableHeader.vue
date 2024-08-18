<script setup lang="ts">
import type { ColumnDefinitionInfo } from '@/lib/schema/columns/definition/base'

defineProps<{
  column: ColumnDefinitionInfo
}>()
</script>

<template>
  <span class="flex items-center gap-3">
    <span>{{ column.name }}</span>
    <span class="text-xs font-normal">{{ column.dataType }}</span>
  </span>
</template>

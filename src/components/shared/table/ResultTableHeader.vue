<script setup lang="ts">
import type { FieldInfo } from '@/lib/schema/columns/definition/base'

defineProps<{
  field: FieldInfo
}>()
</script>

<template>
  <span class="flex items-center gap-3">
    <span>{{ field.name }}</span>
    <span class="text-xs font-normal">{{ field.dataType }}</span>
  </span>
</template>

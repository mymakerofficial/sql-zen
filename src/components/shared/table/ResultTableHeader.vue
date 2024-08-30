<script setup lang="ts">
import {
  ColumnDefinition,
  type FieldInfo,
} from '@/lib/schema/columns/definition/base'
import { PseudoDataType } from '@/lib/schema/columns/types/base'

defineProps<{
  field: FieldInfo
}>()
</script>

<template>
  <span class="flex items-center gap-3">
    <span>{{ field.name }}</span>
    <span
      v-if="field.dataType !== PseudoDataType.Unknown"
      class="text-xs font-normal"
      >{{ ColumnDefinition.fromField(field).getDataTypeDisplayName() }}</span
    >
  </span>
</template>

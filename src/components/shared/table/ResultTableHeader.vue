<script setup lang="ts">
import { ColumnDefinition, type FieldInfo } from '@/lib/schema/columns/column'
import { PseudoDataType } from '@/lib/schema/columns/types/base'
import { CircleHelpIcon } from 'lucide-vue-next'

defineProps<{
  field: FieldInfo
}>()
</script>

<template>
  <span class="flex items-center gap-3">
    <span>{{ field.name }}</span>
    <span class="text-xs font-normal">{{
      ColumnDefinition.fromField(field).getDataTypeDisplayName()
    }}</span>
    <span v-if="field.dataType === PseudoDataType.Unknown">
      <CircleHelpIcon class="size-3.5" />
    </span>
  </span>
</template>

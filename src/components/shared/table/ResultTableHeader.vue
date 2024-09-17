<script setup lang="ts">
import { ColumnDefinition, type FieldInfo } from '@/lib/schema/columns/column'
import { PseudoDataType } from '@/lib/schema/columns/types/base'
import { BookDashedIcon } from 'lucide-vue-next'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

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
    <Tooltip v-if="field.dataType === PseudoDataType.Unknown">
      <TooltipTrigger>
        <BookDashedIcon class="size-4" />
      </TooltipTrigger>
      <TooltipContent>
        <p>SqlZen doesn't know this type. It may be a custom type or a bug.</p>
      </TooltipContent>
    </Tooltip>
  </span>
</template>

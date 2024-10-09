<script setup lang="ts">
import { FieldDefinition, type FieldInfo } from '@/lib/schema/columns/column'
import { PseudoDataType } from '@/lib/schema/columns/types/base'
import { BadgeInfoIcon, BookDashedIcon } from 'lucide-vue-next'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import CodeBlock from '@/components/shared/CodeBlock.vue'
import { computed } from 'vue'

const props = defineProps<{
  field: FieldInfo
}>()

const displayName = computed(() =>
  FieldDefinition.from(props.field).getTypeDisplayName(),
)
const typeDef = computed(() =>
  FieldDefinition.from(props.field).getRecursiveDDLTypeDeclaration(),
)
</script>

<template>
  <span class="flex items-center gap-2">
    <span>{{ field.name }}</span>
    <HoverCard v-if="typeDef">
      <HoverCardTrigger
        class="flex items-center gap-2 text-xs font-normal hover:underline cursor-pointer"
      >
        <span>{{ displayName }}</span>
        <BadgeInfoIcon class="size-4" />
      </HoverCardTrigger>
      <HoverCardContent side="top" class="w-min space-y-2">
        <h3 class="flex items-center gap-2 text-muted-foreground text-sm">
          <BadgeInfoIcon class="size-4" />
          <span>auto-generated type definition</span>
        </h3>
        <CodeBlock :code="typeDef" class="[&_pre]:!bg-transparent text-xs" />
      </HoverCardContent>
    </HoverCard>
    <span v-else class="text-xs font-normal">
      {{ displayName }}
    </span>
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

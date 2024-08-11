<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import DatabaseSelectItemContent from '@/components/shared/databaseEngineSelect/DatabaseSelectItemContent.vue'
import { SelectTrigger as RadixSelectTrigger } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { DatabaseEngine } from '@/lib/engines/enums'
import {
  databaseEngines,
  selectableDatabaseEngines,
} from '@/lib/engines/constants'

const model = defineModel<DatabaseEngine>({
  default: DatabaseEngine.PostgreSQL,
})

const emit = defineEmits<{
  select: [DatabaseEngine]
}>()

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

function handleSelect(value: string) {
  emit('select', value as DatabaseEngine)
}
</script>

<template>
  <Select v-model="model" @update:model-value="handleSelect">
    <RadixSelectTrigger v-if="$slots.default" as-child>
      <slot />
    </RadixSelectTrigger>
    <SelectTrigger v-else :class="props.class">
      <SelectValue
        placeholder="Select database..."
        class="pr-3 [&_[data-description]]:hidden"
      />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectItem
          v-for="item in selectableDatabaseEngines"
          :value="item.engine"
          :key="item.engine"
          class="px-3"
        >
          <DatabaseSelectItemContent v-bind="item" />
        </SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>

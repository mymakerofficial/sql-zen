<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { type DatabaseEngine, databaseEnginesList } from '@/lib/databaseEngines'
import DatabaseSelectItemContent from '@/components/shared/databaseEngineSelect/DatabaseSelectItemContent.vue'
import { SelectTrigger as RadixSelectTrigger } from 'radix-vue'
import type { HTMLAttributes } from 'vue'

const model = defineModel<DatabaseEngine>({ default: 'postgresql' })

const emit = defineEmits<{
  select: [DatabaseEngine]
}>()

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

function handleSelect(value: DatabaseEngine) {
  emit('select', value)
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
          v-for="item in databaseEnginesList"
          :value="item.key"
          :key="item.key"
          class="px-3"
        >
          <DatabaseSelectItemContent v-bind="item" />
        </SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>

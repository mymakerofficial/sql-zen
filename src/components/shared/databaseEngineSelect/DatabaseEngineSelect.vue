<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'
import { type DatabaseEngine, databaseEnginesList } from '@/lib/databaseEngines'
import DatabaseSelectItemContent from '@/components/shared/databaseEngineSelect/DatabaseSelectItemContent.vue'
import { SelectIcon, SelectTrigger } from 'radix-vue'
import { ChevronDown } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

const model = defineModel<DatabaseEngine>({ default: 'postgresql' })

const emit = defineEmits<{
  select: [DatabaseEngine]
}>()

function handleSelect(value: DatabaseEngine) {
  emit('select', value)
}
</script>

<template>
  <Select v-model="model" @update:model-value="handleSelect">
    <SelectTrigger as-child>
      <slot>
        <Button
          variant="ghost"
          class="w-fit !bg-transparent [&_[data-description]]:hidden"
        >
          <SelectValue placeholder="Select database..." class="pr-3" />
          <SelectIcon as-child>
            <ChevronDown class="w-4 h-4 opacity-50" />
          </SelectIcon>
        </Button>
      </slot>
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

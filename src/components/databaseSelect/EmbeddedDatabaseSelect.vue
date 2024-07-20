<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { databaseSystemsList } from '@/lib/databaseSystems'
import DatabaseSelectItemContent from '@/components/databaseSelect/DatabaseSelectItemContent.vue'

const model = defineModel<string>({ default: 'postgresql' })
</script>

<template>
  <Select v-model="model">
    <SelectTrigger
      class="w-fit bg-transparent border-transparent [&_[data-description]]:hidden">
      <SelectValue placeholder="Select database..." class="pr-3" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectItem
          v-for="item in databaseSystemsList"
          :value="item.key"
          class="px-3">
          <DatabaseSelectItemContent v-bind="item" />
        </SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>

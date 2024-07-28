<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { HTMLAttributes } from 'vue'
import { CpuIcon, HardDriveIcon } from 'lucide-vue-next'
import { DataSourceMode } from '@/lib/dataSources/enums'

const model = defineModel<DataSourceMode>({ required: true })

const props = defineProps<{
  class: HTMLAttributes['class']
}>()
</script>

<template>
  <Select v-model="model">
    <SelectTrigger :class="props.class">
      <SelectValue placeholder="Select mode..." />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectItem :value="DataSourceMode.Memory" class="px-3">
          <div class="flex items-center gap-2">
            <CpuIcon class="size-4 min-w-max" />
            <span>In Memory</span>
          </div>
        </SelectItem>
        <SelectItem :value="DataSourceMode.BrowserPersisted" class="px-3">
          <div class="flex items-center gap-2">
            <HardDriveIcon class="size-4 min-w-max" />
            <span>Persisted</span>
          </div>
        </SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>

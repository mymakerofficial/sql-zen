<script setup lang="ts">
import { DatabaseEngineMode } from '@/lib/databases/database'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from '@/components/ui/select'
import type { HTMLAttributes } from 'vue'
import { CpuIcon, HardDriveIcon } from 'lucide-vue-next'

const model = defineModel<DatabaseEngineMode>({ required: true })

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
        <SelectItem :value="DatabaseEngineMode.Memory" class="px-3">
          <div class="flex items-center gap-2">
            <CpuIcon class="size-4" />
            <span>In Memory</span>
          </div>
        </SelectItem>
        <SelectItem :value="DatabaseEngineMode.BrowserPersisted" class="px-3">
          <div class="flex items-center gap-2">
            <HardDriveIcon class="size-4" />
            <span>Persisted</span>
          </div>
        </SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>

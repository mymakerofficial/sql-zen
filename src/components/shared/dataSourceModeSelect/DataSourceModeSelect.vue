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
import DataSourceModeSelectItemContent from '@/components/shared/dataSourceModeSelect/DataSourceModeSelectItemContent.vue'

const model = defineModel<DataSourceMode>({ required: true })

const props = defineProps<{
  class: HTMLAttributes['class']
}>()
</script>

<template>
  <Select v-model="model">
    <SelectTrigger :class="props.class">
      <SelectValue
        placeholder="Select mode..."
        class="pr-3 [&_[data-description]]:hidden"
      />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectItem :value="DataSourceMode.Memory" class="px-3">
          <DataSourceModeSelectItemContent
            :icon="CpuIcon"
            name="In Memory"
            description="Data is kept in memory and will be lost when the application is closed or reloaded."
          />
        </SelectItem>
        <SelectItem :value="DataSourceMode.BrowserPersisted" class="px-3">
          <DataSourceModeSelectItemContent
            :icon="HardDriveIcon"
            name="Persisted"
            description="Data will be saved in your browser. Nothing is sent to our servers. Data will be lost if you clear your browser's data."
          />
        </SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>

<script setup lang="ts">
import { useFormContext } from 'vee-validate'
import type { DataSourceData } from '@/lib/dataSources/types'
import { getEngineInfo } from '@/lib/engines/helpers'
import { computed } from 'vue'
import { getDataSourceModeInfo } from '@/lib/dataSources/helpers'
import { ChevronRightIcon, DotIcon } from 'lucide-vue-next'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DatabaseEngine } from '@/lib/engines/enums'
import { DataSourceMode } from '@/lib/dataSources/enums'

const { values } = useFormContext<DataSourceData>()

const engine = computed(() => getEngineInfo(values.engine))
const mode = computed(() => getDataSourceModeInfo(values.mode))
</script>

<template>
  <div class="flex gap-5 items-center py-2">
    <Tooltip>
      <TooltipTrigger>
        <span class="flex gap-2 items-center text-sm font-medium">
          <img :src="engine.icon" :alt="`${engine.name} Logo`" class="size-4" />
          <span class="truncate">{{ engine.name }}</span>
        </span>
      </TooltipTrigger>
      <TooltipContent class="flex gap-1 items-center">
        <span>DBMS</span>
        <DotIcon class="size-4" />
        <span class="max-w-80 truncate">
          {{ engine.description }}
        </span>
      </TooltipContent>
    </Tooltip>
    <ChevronRightIcon class="size-4" />
    <Tooltip>
      <TooltipTrigger>
        <span class="flex gap-2 items-center text-sm font-medium">
          <component :is="mode.icon" class="size-4" />
          <span class="truncate">{{ mode.name }}</span>
        </span>
      </TooltipTrigger>
      <TooltipContent class="flex gap-1 items-center">
        <span>Mode</span>
        <DotIcon class="size-4" />
        <span class="max-w-80 truncate">
          {{ mode.description }}
        </span>
      </TooltipContent>
    </Tooltip>
  </div>
</template>

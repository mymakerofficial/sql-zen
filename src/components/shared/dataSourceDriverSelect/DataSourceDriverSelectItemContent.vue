<script setup lang="ts">
import type { DataSourceDriverInfo } from '@/lib/engines/interface'
import { useDriverSupports } from '@/composables/engines/useDriverSupports'
import { DataSourceDriverCapability } from '@/lib/engines/enums'
import { AppWindowIcon } from 'lucide-vue-next'
import { computed } from 'vue'
import { isTauri } from '@tauri-apps/api/core'

const props = defineProps<DataSourceDriverInfo>()

const requiresDesktop = useDriverSupports(
  () => props.driver,
  DataSourceDriverCapability.RequiresDesktopApp,
)

const showRequiresDesktop = computed(() => {
  return requiresDesktop.value && !isTauri()
})
</script>

<template>
  <div class="my-1 flex flex-col gap-2 max-w-80">
    <div class="flex items-center gap-3">
      <img :src="icon" :alt="`${name} Icon`" class="size-4 min-h-max" />
      <span>{{ name }}</span>
      <span
        v-if="showRequiresDesktop"
        class="flex gap-1 items-center text-xs px-1 py-0.5 rounded-sm bg-rose-500/20 text-rose-200"
        data-description
      >
        <AppWindowIcon class="size-3" />
        Requires Desktop App
      </span>
    </div>
    <p class="pl-7 pr-2 text-xs text-muted-foreground" data-description>
      {{ description }}
    </p>
  </div>
</template>

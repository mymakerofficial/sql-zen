<script setup lang="ts">
import ColorModeSelect from '@/components/shared/ColorModeSelect.vue'
import { Separator } from '@/components/ui/separator'
import AppHeaderMenu from '@/components/shared/appHeader/AppHeaderMenu.vue'
import LogoButton from '@/components/shared/appHeader/LogoButton.vue'
import { useDataSourceDescriptor } from '@/composables/useDataSourceDescriptor'
import { computed } from 'vue'
import { getEngineInfo } from '@/lib/engines/helpers'

const activeDataSource = defineModel<string | null>('activeDataSource', {
  required: true,
  default: null,
})

const dataSource = useDataSourceDescriptor(activeDataSource)
const engineInfo = computed(() => {
  const engine = dataSource.value?.engine
  return engine ? getEngineInfo(engine) : null
})
</script>

<template>
  <nav
    class="relative h-16 px-3 flex items-center justify-between border-b border-border"
  >
    <div class="h-full flex items-center gap-3">
      <LogoButton />
      <Separator orientation="vertical" class="h-4" />
      <div v-if="dataSource" class="px-4 hidden md:flex gap-1 items-center">
        <img
          :src="engineInfo?.icon"
          :alt="engineInfo?.name"
          class="inline size-5 mr-3"
        />
        <span class="text-sm font-medium">{{
          dataSource.identifier ?? engineInfo?.name
        }}</span>
      </div>
      <AppHeaderMenu :data-source="activeDataSource" />
    </div>
    <div class="h-full flex items-center">
      <ColorModeSelect />
      <slot />
    </div>
  </nav>
</template>

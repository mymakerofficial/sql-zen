<script setup lang="ts">
import AppHeader from '@/components/shared/appHeader/AppHeader.vue'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { useEnv } from '@/composables/useEnv'
import { useWindowSize } from '@vueuse/core'
import { computed } from 'vue'

const { isSmallScreen, isTauri, isWindows } = useEnv()

const minWidth = 240
const { width } = useWindowSize()
const minSize = computed(() => {
  return (minWidth / width.value) * 100
})
</script>

<template>
  <div vaul-drawer-wrapper class="bg-background h-screen flex flex-col">
    <AppHeader
      v-if="(!isSmallScreen && !isTauri) || (isSmallScreen && isWindows)"
    />
    <main class="flex-1 overflow-auto">
      <ResizablePanelGroup direction="horizontal">
        <template v-if="!isSmallScreen">
          <ResizablePanel :default-size="18" :min-size="minSize">
            <slot name="aside" />
          </ResizablePanel>
          <ResizableHandle />
        </template>
        <ResizablePanel>
          <slot name="main" />
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  </div>
</template>

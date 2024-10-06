<script setup lang="ts">
import AppHeader from '@/components/shared/appHeader/AppHeader.vue'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { useEnv } from '@/composables/useEnv'

const { isSmallScreen, isTauri } = useEnv()
</script>

<template>
  <div vaul-drawer-wrapper class="bg-background h-screen flex flex-col">
    <AppHeader v-if="!isSmallScreen && !isTauri" />
    <main class="flex-1 overflow-auto">
      <ResizablePanelGroup direction="horizontal">
        <template v-if="!isSmallScreen">
          <ResizablePanel :default-size="18" class="min-w-60">
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

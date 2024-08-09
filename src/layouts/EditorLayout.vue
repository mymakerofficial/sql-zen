<script setup lang="ts">
import AppHeader from '@/components/shared/appHeader/AppHeader.vue'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { useMediaQuery } from '@vueuse/core'

const smallScreen = useMediaQuery('(max-width: 640px)') // sm
</script>

<template>
  <div class="h-screen flex flex-col">
    <AppHeader :active-data-source="null" />
    <ResizablePanelGroup direction="horizontal">
      <template v-if="!smallScreen">
        <ResizablePanel :default-size="18">
          <slot name="aside" />
        </ResizablePanel>
        <ResizableHandle />
      </template>
      <ResizablePanel>
        <slot name="main" />
      </ResizablePanel>
    </ResizablePanelGroup>
  </div>
</template>

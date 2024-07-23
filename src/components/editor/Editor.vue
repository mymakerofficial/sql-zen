<script setup lang="ts">
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import DatabaseExplorerPanel from '@/components/editor/DatabaseExplorerPanel.vue'
import { type RegisteredDatabase } from '@/lib/registry/registry'
import Console from '@/components/console/Console.vue'
import { ref } from 'vue'

const selected = ref<RegisteredDatabase | null>(null)
</script>

<template>
  <ResizablePanelGroup direction="horizontal">
    <ResizablePanel :default-size="18">
      <DatabaseExplorerPanel v-model:selected="selected" />
    </ResizablePanel>
    <ResizableHandle />
    <ResizablePanel>
      <Console
        v-if="selected"
        :database-key="selected.key"
        :key="selected.key"
      />
    </ResizablePanel>
  </ResizablePanelGroup>
</template>

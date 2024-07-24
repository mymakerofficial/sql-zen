<script setup lang="ts">
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import DatabaseExplorerPanel from '@/components/editor/DatabaseExplorerPanel.vue'
import Console from '@/components/console/Console.vue'
import { ref } from 'vue'
import { useDataSources } from '@/composables/useDataSources'
import { whenever } from '@vueuse/core'
import { useRegistry } from '@/composables/useRegistry'

const selected = ref<string | null>(null)

const registry = useRegistry()
const databases = useDataSources()

whenever(
  () => databases.value.length === 1,
  () => {
    const key = databases.value[0].key
    registry.wake(key)
    selected.value = key
  },
  { immediate: true },
)
</script>

<template>
  <ResizablePanelGroup direction="horizontal">
    <ResizablePanel :default-size="18">
      <DatabaseExplorerPanel v-model:selected="selected" />
    </ResizablePanel>
    <ResizableHandle />
    <ResizablePanel>
      <Console v-if="selected" :data-source-key="selected" :key="selected" />
      <div
        v-else
        class="flex items-center justify-center h-full text-muted-foreground"
      >
        <p v-if="databases.length">
          Select a data source from the list to start querying
        </p>
        <p v-else>Create a data source to start querying</p>
      </div>
    </ResizablePanel>
  </ResizablePanelGroup>
</template>

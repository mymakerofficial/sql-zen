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
import { useRegisteredDatabases } from '@/composables/useRegisteredDatabases'
import { whenever } from '@vueuse/core'
import { useRegistry } from '@/composables/useRegistry'

const selected = ref<string | null>(null)

const registry = useRegistry()
const databases = useRegisteredDatabases()

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
      <Console v-if="selected" :database-key="selected" :key="selected" />
      <div
        v-else
        class="flex items-center justify-center h-full text-muted-foreground"
      >
        <p>Create a database to start querying</p>
      </div>
    </ResizablePanel>
  </ResizablePanelGroup>
</template>

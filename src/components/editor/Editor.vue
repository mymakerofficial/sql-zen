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

const selected = ref<RegisteredDatabase | null>(null)

const registry = useRegistry()
const databases = useRegisteredDatabases()

whenever(
  () => databases.value.length === 1,
  () => {
    selected.value = registry.wake(databases.value[0].key)
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
      <Console
        v-if="selected"
        :database-key="selected.key"
        :key="selected.key"
      />
    </ResizablePanel>
  </ResizablePanelGroup>
</template>

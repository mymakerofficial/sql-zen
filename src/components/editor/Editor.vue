<script setup lang="ts">
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import DatabaseExplorerPanel from '@/components/databaseExplorer/DatabaseExplorer.vue'
import Console from '@/components/console/Console.vue'
import { ref } from 'vue'
import { useDataSources } from '@/composables/useDataSources'
import { useMediaQuery, whenever } from '@vueuse/core'
import { useRegistry } from '@/composables/useRegistry'
import EditorLayout from '@/layouts/EditorLayout.vue'
import DatabaseExplorerContent from '@/components/databaseExplorer/DatabaseExplorerContent.vue'
import DatabaseExplorerDrawer from '@/components/databaseExplorer/DatabaseExplorerDrawer.vue'

const smallScreen = useMediaQuery('(max-width: 640px)') // sm

const selected = ref<string | null>(null)

const registry = useRegistry()
const databases = useDataSources()

whenever(
  () => databases.value.length === 1,
  () => {
    const key = databases.value[0]
    registry.start(key)
    selected.value = key
  },
  { immediate: true },
)
</script>

<template>
  <EditorLayout>
    <template #header v-if="smallScreen">
      <DatabaseExplorerDrawer selected="selected" />
    </template>
    <ResizablePanelGroup direction="horizontal">
      <template v-if="!smallScreen">
        <ResizablePanel :default-size="18">
          <DatabaseExplorerPanel v-model:selected="selected" />
        </ResizablePanel>
        <ResizableHandle />
      </template>
      <ResizablePanel>
        <KeepAlive v-if="selected">
          <Console :data-source-key="selected" :key="selected" />
        </KeepAlive>
        <div
          v-if="!selected"
          class="flex items-center justify-center h-full text-muted-foreground"
        >
          <div v-if="smallScreen" class="flex flex-col gap-2 flex-1">
            <p class="mx-8 text-primary font-medium">
              Select a data source to start
            </p>
            <DatabaseExplorerContent v-model:selected="selected" class="mx-4" />
          </div>
          <p v-else-if="databases.length">
            Select a data source from the list to start querying
          </p>
          <p v-else>Create a data source to start querying</p>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  </EditorLayout>
</template>

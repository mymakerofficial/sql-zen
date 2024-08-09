<script setup lang="ts">
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import DatabaseExplorer from '@/components/databaseExplorer/DatabaseExplorer.vue'
import { watchEffect } from 'vue'
import { useDataSources } from '@/composables/useDataSources'
import { useMediaQuery, whenever } from '@vueuse/core'
import { useRegistry } from '@/composables/useRegistry'
import EditorLayout from '@/layouts/EditorLayout.vue'
import DatabaseExplorerDrawer from '@/components/databaseExplorer/DatabaseExplorerDrawer.vue'
import { tabManager } from '@/lib/tabs/manager'
import { TabType } from '@/lib/tabs/enums'
import TabView from '@/components/shared/tabs/TabView.vue'

const smallScreen = useMediaQuery('(max-width: 640px)') // sm

const registry = useRegistry()
const databases = useDataSources()

watchEffect(() => {
  databases.value.forEach((key) => {
    tabManager.createTab({
      type: TabType.Console,
      dataSourceKey: key,
    })
  })
})
</script>

<template>
  <EditorLayout>
    <template #header v-if="smallScreen">
      <DatabaseExplorerDrawer />
    </template>
    <ResizablePanelGroup direction="horizontal">
      <template v-if="!smallScreen">
        <ResizablePanel :default-size="18">
          <DatabaseExplorer />
        </ResizablePanel>
        <ResizableHandle />
      </template>
      <ResizablePanel>
        <TabView />
      </ResizablePanel>
    </ResizablePanelGroup>
  </EditorLayout>
</template>

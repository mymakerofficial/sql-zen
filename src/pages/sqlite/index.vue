<script setup lang="ts">
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import DatabaseExplorerPanel from '@/components/DatabaseExplorerPanel.vue'
import { onMounted, onScopeDispose } from 'vue'
import AppLayout from '@/layouts/AppLayout.vue'
import { useInit } from '@/composables/useInit'
import { SqliteFacade } from '@/lib/databases/sqlite'
import Editor from '@/components/editor/Editor.vue'
import example from './example.sql?raw'

const sqlite = new SqliteFacade()

const { init, isInitializing } = useInit(sqlite)

onMounted(init)
onScopeDispose(sqlite.close)
</script>

<template>
  <AppLayout>
    <main class="flex-1 flex flex-col">
      <ResizablePanelGroup direction="horizontal" class="flex-1">
        <ResizablePanel :default-size="0">
          <DatabaseExplorerPanel />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>
          <Editor
            :database="sqlite"
            :init-value="example"
            :is-initializing="isInitializing"
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  </AppLayout>
</template>

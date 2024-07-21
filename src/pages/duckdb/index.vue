<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue'
import { onMounted, onScopeDispose } from 'vue'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import DatabaseExplorerPanel from '@/components/DatabaseExplorerPanel.vue'
import { useInit } from '@/composables/useInit'
import { DuckdbFacade } from '@/lib/databases/duckdb'
import Console from '@/components/console/Console.vue'
import example from './example'

const duckdb = new DuckdbFacade()

const { init, isInitializing } = useInit(duckdb)

onMounted(init)
onScopeDispose(duckdb.close)
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
          <Console
            :database="duckdb"
            :editor-value="example"
            :is-initializing="isInitializing"
            loading-message="Loading DuckDB"
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  </AppLayout>
</template>

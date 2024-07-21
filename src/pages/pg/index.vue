<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import DatabaseExplorerPanel from '@/components/DatabaseExplorerPanel.vue'
import { onMounted, onScopeDispose } from 'vue'
import { useInit } from '@/composables/useInit'
import { PostgresqlFacade } from '@/lib/databases/postgresql'
import Console from '@/components/console/Console.vue'
import example from './example.sql?raw'

const pg = new PostgresqlFacade()

const { init, isInitializing } = useInit(pg)

onMounted(init)
onScopeDispose(pg.close)
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
            :database="pg"
            :editor-value="example"
            :is-initializing="isInitializing"
            loading-message="Loading PostgreSQL"
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  </AppLayout>
</template>

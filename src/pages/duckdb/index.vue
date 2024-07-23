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
import Editor from '@/components/editor/Editor.vue'
import example from './example'

const duckdb = new DuckdbFacade()

const { init, isInitializing } = useInit(duckdb)

onMounted(init)
onScopeDispose(duckdb.close)
</script>

<template>
  <AppLayout>
    <main class="flex-1 flex flex-col">
      <Editor
        :database="duckdb"
        :init-value="example"
        :is-initializing="isInitializing"
      />
    </main>
  </AppLayout>
</template>

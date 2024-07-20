<script setup lang="ts">
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import Editor from '@/components/Editor.vue'
import DatabaseExplorerPanel from '@/components/DatabaseExplorerPanel.vue'
import ConsoleToolbar from '@/components/ConsoleToolbar.vue'
import sqlite3InitModule, {
  type Database as SqliteDatabase,
} from '@sqlite.org/sqlite-wasm'
import { onMounted, onScopeDispose, ref } from 'vue'
import AppLayout from '@/layouts/AppLayout.vue'
import ResultTable from '@/components/table/ResultTable.vue'
import * as monaco from 'monaco-editor'
import example from './example.sql?raw'
import { LoaderCircleIcon } from 'lucide-vue-next'
import { useInit } from '@/composables/useInit'
import { useQuery } from '@/composables/useQuery'
import { useSqlite } from '@/composables/useSqlite'

const model = monaco.editor.createModel(example, 'sql')

const sqlite = useSqlite()
const { init, isInitializing } = useInit(sqlite)
const { query, data, error, reset, isPending } = useQuery(sqlite)

function handleRun() {
  query(model.getValue())
}

function handleClear() {
  model.setValue('')
  reset()
}

onMounted(init)
onScopeDispose(sqlite.close)
</script>

<template>
  <AppLayout>
    <main v-if="!isInitializing" class="flex-1 flex flex-col">
      <ResizablePanelGroup direction="horizontal" class="flex-1">
        <ResizablePanel :default-size="0">
          <DatabaseExplorerPanel />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel>
              <ConsoleToolbar
                @run="handleRun"
                @clear="handleClear"
                :disable-run="isPending"
              />
              <Editor :model="model" />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel :default-size="24">
              <div v-if="error" class="p-6 bg-red-500/10 text-red-500">
                <p>{{ error.message }}</p>
              </div>
              <div v-else-if="!isPending" class="h-full overflow-y-auto">
                <ResultTable :data="data" />
              </div>
              <div v-else class="h-full flex justify-center items-center">
                <LoaderCircleIcon
                  class="size-8 animate-spin text-muted-foreground"
                />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
    <main v-else class="flex-1 flex items-center justify-center">
      <div class="flex gap-2 items-center text-muted-foreground">
        <LoaderCircleIcon class="size-5 animate-spin" />
        <p>Loading SQLite</p>
      </div>
    </main>
  </AppLayout>
</template>

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
import { onMounted, ref } from 'vue'
import AppLayout from '@/layouts/AppLayout.vue'
import ResultTable from '@/components/table/ResultTable.vue'
import * as monaco from 'monaco-editor'
import example from './example.sql?raw'
import { LoaderCircleIcon } from 'lucide-vue-next'

let database: SqliteDatabase | null = null

const model = monaco.editor.createModel(example, 'sql')
const result = ref<Array<object>>([])
const isLoading = ref(false)

function handleRun() {
  if (!database) {
    throw new Error('SQLite database is not initialized')
  }

  isLoading.value = true

  const query = model.getValue()
  console.debug('SQLite: Running query:', query)

  try {
    result.value = database.exec(query, {
      rowMode: 'object',
      returnValue: 'resultRows',
    }) as Array<object>
  } catch (error) {
    console.error('SQLite: Error running query:', error)
    result.value = [
      {
        error_message: (error as Error).message ?? 'Unknown error',
      },
    ]
  }

  isLoading.value = false
}

function handleClear() {
  model.setValue('')
  result.value = []
}

onMounted(async () => {
  isLoading.value = true
  console.debug('Initializing SQLite3')
  const sqlite3 = await sqlite3InitModule({
    print: console.log,
    printErr: console.error,
  })
  console.debug('Running SQLite3 version', sqlite3.version.libVersion)
  database = new sqlite3.oo1.DB('/mydb.sqlite3', 'ct')
  console.debug('SQLite3 database initialized')
  isLoading.value = false
})
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
          <ResizablePanelGroup direction="vertical">
            <!-- <Tabs /> -->
            <ResizablePanel>
              <ConsoleToolbar @run="handleRun" @clear="handleClear" />
              <Editor :model="model" />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel :default-size="24">
              <div v-if="!isLoading" class="h-full overflow-y-auto">
                <ResultTable :data="result" />
              </div>
              <div v-else class="h-full flex justify-center items-center">
                <LoaderCircleIcon
                  class="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  </AppLayout>
</template>

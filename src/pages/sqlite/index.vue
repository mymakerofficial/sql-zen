<script setup lang="ts">
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import Editor from '@/components/Editor.vue'
import DatabaseExplorerPanel from '@/components/DatabaseExplorerPanel.vue'
import ConsoleToolbar from '@/components/ConsoleToolbar.vue'
import sqlite3InitModule, { type Database as SqliteDatabase } from '@sqlite.org/sqlite-wasm'
import { onMounted, ref } from 'vue'
import AppLayout from '@/layouts/AppLayout.vue'
import ResultTable from '@/components/table/ResultTable.vue'
import * as monaco from 'monaco-editor'
import example from './example.sql?raw'

let database: SqliteDatabase | null = null

const model = monaco.editor.createModel(example, 'sql')
const result = ref<Array<object>>([])

function handleRun() {
  if (!database) {
    throw new Error('SQLite database is not initialized')
  }

  const query = model.getValue()
  console.debug('SQLite: Running query:', query)

  try {
    result.value = database.exec(query, {
      rowMode: 'object',
      returnValue: 'resultRows',
    }) as Array<object>
  } catch (error) {
    console.error('SQLite: Error running query:', error)
    result.value = [{
      'error_message': (error as Error).message ?? 'Unknown error',
    }]
  }
}

function handleClear() {
  model.setValue('')
  result.value = []
}

onMounted(async () => {
  console.debug('Initializing SQLite3')
  const sqlite3 = await sqlite3InitModule({
    print: console.log,
    printErr: console.error,
  })
  console.debug('Running SQLite3 version', sqlite3.version.libVersion)
  database = new sqlite3.oo1.DB('/mydb.sqlite3', 'ct')
  console.debug('SQLite3 database initialized')
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
              <ConsoleToolbar
                @run="handleRun"
                @clear="handleClear"
              />
              <Editor :model="model" />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel :default-size="24">
              <div class="h-full overflow-y-auto">
                <ResultTable :data="result" />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  </AppLayout>
</template>
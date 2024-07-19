<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue'
import { PGlite } from '@electric-sql/pglite'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import Editor from '@/components/Editor.vue'
import DatabaseExplorerPanel from '@/components/DatabaseExplorerPanel.vue'
import ConsoleToolbar from '@/components/ConsoleToolbar.vue'
import ResultTable from '@/components/table/ResultTable.vue'
import { ref } from 'vue'
import example from './example.sql?raw'
import * as monaco from 'monaco-editor'

const database = new PGlite()

const model = monaco.editor.createModel(example, 'sql')
const result = ref<Array<object>>([])

function handleRun() {
  const query = model.getValue()
  console.debug('PostgreSQL: Running query:', query)
  database.exec(query)
    .then((res) => {
      console.debug('PostgreSQL: Query result:', res)
      result.value = res[res.length - 1].rows
    })
    .catch((error) => {
      console.error('PostgreSQL: Error running query:', error)
      result.value = [{
        'error_message': error.message ?? 'Unknown error'
      }]
    })
}

function handleClear() {
  model.setValue('')
  result.value = []
}
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
<script setup lang="ts">
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import Editor from '@/components/Editor.vue'
import DatabaseExplorerPanel from '@/components/DatabaseExplorerPanel.vue'
import ConsoleToolbar from '@/components/ConsoleToolbar.vue'
import { onMounted, onScopeDispose } from 'vue'
import AppLayout from '@/layouts/AppLayout.vue'
import ResultTable from '@/components/table/ResultTable.vue'
import * as monaco from 'monaco-editor'
import example from './example.sql?raw'
import { LoaderCircleIcon } from 'lucide-vue-next'
import { useInit } from '@/composables/useInit'
import { useExec } from '@/composables/useExec'
import { SqliteFacade } from '@/lib/databases/sqlite'

const model = monaco.editor.createModel(example, 'sql')
const sqlite = new SqliteFacade()

const { init, isInitializing } = useInit(sqlite)
const { exec, data, error, reset, isPending } = useExec(sqlite)

function handleRun() {
  exec(model.getValue())
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
    <main class="flex-1 flex flex-col">
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
                :disable-run="isInitializing || isPending"
              />
              <Editor :model="model" />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel :default-size="24">
              <div
                v-if="isInitializing"
                class="h-24 flex items-center justify-center gap-2"
              >
                <LoaderCircleIcon class="size-5 animate-spin" />
                <span>Loading SQLite</span>
              </div>
              <div
                v-else-if="isPending"
                class="h-24 flex items-center justify-center"
              >
                <LoaderCircleIcon class="size-5 animate-spin" />
              </div>
              <div v-else-if="error" class="p-6 bg-red-500/10 text-red-500">
                <p>{{ error.message }}</p>
              </div>
              <div v-else class="h-full overflow-y-auto">
                <ResultTable
                  v-for="(res, index) in data"
                  :data="res"
                  :key="index"
                />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  </AppLayout>
</template>

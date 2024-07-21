<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue'
import { onMounted, onScopeDispose } from 'vue'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import Editor from '@/components/shared/editor/MonacoEditor.vue'
import DatabaseExplorerPanel from '@/components/DatabaseExplorerPanel.vue'
import ConsoleToolbar from '@/components/console/ConsoleToolbar.vue'
import * as monaco from 'monaco-editor'
import example from './example'
import { LoaderCircleIcon } from 'lucide-vue-next'
import { useExec } from '@/composables/useExec'
import { useInit } from '@/composables/useInit'
import { DuckdbFacade } from '@/lib/databases/duckdb'
import ConsoleResultPanel from '@/components/console/ConsoleResultPanel.vue'

const model = monaco.editor.createModel(example, 'sql')
const duckdb = new DuckdbFacade()

const { init, isInitializing } = useInit(duckdb)
const { exec, data, error, reset, isPending } = useExec(duckdb)

function handleRun() {
  exec(model.getValue())
}

function handleClear() {
  model.setValue('')
  reset()
}

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
                <span>Loading DuckDB</span>
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
              <div v-else class="h-full">
                <ConsoleResultPanel :data="data" />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  </AppLayout>
</template>

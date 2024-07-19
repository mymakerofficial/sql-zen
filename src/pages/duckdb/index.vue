<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue'
import * as duckdb from '@duckdb/duckdb-wasm';
import duckdb_wasm from '@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm?url';
import mvp_worker from '@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js?url';
import duckdb_wasm_eh from '@duckdb/duckdb-wasm/dist/duckdb-eh.wasm?url';
import eh_worker from '@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js?url';
import { onMounted, onScopeDispose, ref } from 'vue'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import Editor from '@/components/Editor.vue'
import DatabaseExplorerPanel from '@/components/DatabaseExplorerPanel.vue'
import ConsoleToolbar from '@/components/ConsoleToolbar.vue'
import ResultTable from '@/components/table/ResultTable.vue'
import * as monaco from 'monaco-editor'
import example from './example'
import { LoaderCircleIcon } from 'lucide-vue-next'

const MANUAL_BUNDLES: duckdb.DuckDBBundles = {
  mvp: {
    mainModule: duckdb_wasm,
    mainWorker: mvp_worker,
  },
  eh: {
    mainModule: duckdb_wasm_eh,
    mainWorker: eh_worker,
  },
};
let connection: duckdb.AsyncDuckDBConnection | null = null

const model = monaco.editor.createModel(example, 'sql')
const result = ref<Array<object>>([])
const isLoading = ref(false)

async function handleRun() {
  if (!connection) {
    throw new Error('DuckDB connection is not initialized')
  }

  const query = model.getValue()

  isLoading.value = true
  const arrowResult = await connection.query(query)
  result.value = JSON.parse(arrowResult.toString()) // TODO: aaaaaaaaaaa
  isLoading.value = false
}

function handleClear() {
  model.setValue('')
  result.value = []
}

onMounted(async () => {
  isLoading.value = true;
  // Select a bundle based on browser checks
  const bundle = await duckdb.selectBundle(MANUAL_BUNDLES);
  // Instantiate the asynchronus version of DuckDB-wasm
  const worker = new Worker(bundle.mainWorker!);
  const logger = new duckdb.ConsoleLogger();
  const database = new duckdb.AsyncDuckDB(logger, worker);
  await database.instantiate(bundle.mainModule, bundle.pthreadWorker);
  console.debug('DuckDB version:', await database.getVersion());
  connection = await database.connect();
  isLoading.value = false;
});

onScopeDispose(() => {
  connection?.close();
});
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
              <div v-if="!isLoading" class="h-full overflow-y-auto">
                <ResultTable :data="result" />
              </div>
              <div v-else class="h-full flex justify-center items-center">
                <LoaderCircleIcon class="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  </AppLayout>
</template>
<script setup lang="ts">
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import Editor from '@/components/Editor.vue'
import DatabaseExplorerPanel from '@/components/DatabaseExplorerPanel.vue'
import ConsoleToolbar from '@/components/ConsoleToolbar.vue'
import sqlite3InitModule, { type Database as SqliteDatabase } from '@sqlite.org/sqlite-wasm'
import { onMounted, ref } from 'vue'
import AppLayout from '@/layouts/AppLayout.vue'
import ResultTable from '@/components/table/ResultTable.vue'

let database: SqliteDatabase | null = null

const result = ref<Array<object>>([])
const query = ref<string>([
  `-- Welcome to sql-zen`,
  `-- You can run queries by clicking the "Run All" button`,
  ``,
  `create table if not exists users (id integer primary key, name text);`,
  ``,
  `insert into users (name) values ('Alice');`,
  `insert into users (name) values ('Bob');`,
  `insert into users (name) values ('Charlie');`,
  ``,
  `select * from users;`,
].join('\n'))


function handleRun() {
  if (!database) {
    throw new Error('SQLite database is not initialized')
  }

  const queryValue = query.value
  console.debug('SQLite: Running query:', queryValue)

  result.value = database.exec(queryValue, {
    rowMode: 'object',
    returnValue: 'resultRows',
  }) as Array<object>
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
              <ConsoleToolbar @run="handleRun" />
              <Editor v-model="query" />
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
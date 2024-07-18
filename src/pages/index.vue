<script setup lang="ts">
import Editor from '@/components/Editor.vue'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { onMounted, ref } from 'vue'
import ConsoleToolbar from '@/components/ConsoleToolbar.vue'
import DatabaseExplorerPanel from '@/components/DatabaseExplorerPanel.vue'
import sqlite3InitModule, { type Database as SqliteDatabase } from '@sqlite.org/sqlite-wasm'
import AppHeader from '@/components/AppHeader.vue'

let sqliteDatabase: SqliteDatabase | null = null

const selectedDatabase = ref<string>('sqlite')
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

function handleRunSqlite() {
  if (!sqliteDatabase) {
    throw new Error('SQLite database is not initialized')
  }

  const queryValue = query.value
  console.debug('SQLite: Running query:', queryValue)

  result.value = sqliteDatabase.exec(queryValue, {
    rowMode: 'object',
    returnValue: 'resultRows',
  }) as Array<object>
}

function handleRunPostgres() {
  result.value = [{
    message: 'PostgreSQL is not yet implemented.',
  }]
}

function handleRun() {
  if (selectedDatabase.value === 'sqlite') {
    handleRunSqlite()
  } else if (selectedDatabase.value === 'postgresql') {
    handleRunPostgres()
  }
}

onMounted(async () => {
  console.debug('Initializing SQLite3')
  const sqlite3 = await sqlite3InitModule({
    print: console.log,
    printErr: console.error,
  })
  console.debug('Running SQLite3 version', sqlite3.version.libVersion)
  sqliteDatabase = new sqlite3.oo1.DB('/mydb.sqlite3', 'ct')
  console.debug('SQLite3 database initialized')
})
</script>

<template>
  <div class="h-screen flex flex-col">
    <AppHeader v-model:database="selectedDatabase" />
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
              <pre class="m-6 text-muted-foreground">{{ result }}</pre>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  </div>
</template>
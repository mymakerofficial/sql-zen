<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue'
import { PGlite } from '@electric-sql/pglite'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import Editor from '@/components/Editor.vue'
import DatabaseExplorerPanel from '@/components/DatabaseExplorerPanel.vue'
import ConsoleToolbar from '@/components/ConsoleToolbar.vue'
import ResultTable from '@/components/table/ResultTable.vue'
import { ref } from 'vue'

const database = new PGlite()

const result = ref<Array<object>>([])
const query = ref<string>([
  `-- Welcome to sql-zen`,
  `-- You can run queries by clicking the "Run All" button`,
`
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  data JSONB
);

INSERT INTO products (name, data)
VALUES ('Quantum Leap Headphones', '{"price": 299.99, "description": "Immersive audio with noise cancellation that transports you."}'),
       ('Office Chair', '{"price": 1499.99, "description": "Experience optimal comfort and support while working."}'),
       ('Virtual Reality Headset', '{"price": 699.99, "description": "Your new favorite way to avoid chores."}');

SELECT
    name,
    (data->>'price')::numeric AS price,
    data->>'description' AS description
FROM products
ORDER BY price;`,
].join('\n'))

function handleRun() {
  console.debug('PostgreSQL: Running query:', query.value)
  database.exec(query.value)
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
  query.value = ''
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
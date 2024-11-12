<script setup lang="ts">
import { useRegistry } from '@/composables/useRegistry'
import { DatabaseEngine, DataSourceDriver } from '@/lib/engines/enums'
import { DataSourceMode } from '@/lib/dataSources/enums'
import * as monaco from 'monaco-editor'
import { useIsRunning } from '@/composables/useIsRunning'
import { useEditor } from '@/composables/editor/useEditor'
import MonacoEditor from '@/components/shared/monaco/MonacoEditor.vue'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import ConsoleResultPanel from '@/components/console/ConsoleResultPanel.vue'
import inlineRun from '@/composables/editor/inlineRun'
import highlightSelected from '@/composables/editor/highlightSelected'
import { whenever } from '@vueuse/core'
import { useQueryClient } from '@tanstack/vue-query'
import { FileAccessor } from '@/lib/files/fileAccessor'
import { StatementExtractor } from '@/lib/statements/extractStatements'

const EDITOR_VALUE = `-- Create a table to store products
CREATE TABLE products (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    heading TEXT,
    description TEXT,
    price NUMERIC NOT NULL CHECK(price >= 0)
);

-- Get average price
SELECT
    avg(price) AS average_price
FROM products;

-- Select all products
SELECT
    name,
    concat(heading, ': ', description) AS details,
    concat(price, '€') AS price
FROM products
ORDER BY price DESC;
`

const INSERT_VALUES = `INSERT INTO products (name, heading, description, price)
VALUES
    ('Quantum Leap Headphones', 'Sonic Bliss Unleashed', 'Immersive audio with noise cancellation that transports you.', 299.99),
    ('Smartphone', 'Your Digital Life', 'The ultimate device for staying connected and entertained.', 999.99),
    ('Smartwatch', 'Your Wrist, Your World', 'Stay connected and track your fitness goals.', 199.99),
    ('Office Chair', 'Elevate Your Workspace', 'Experience optimal comfort and support while working.', 1499.99),
    ('Virtual Reality Headset', 'Escape the Ordinary', 'Your new favorite way to avoid chores.', 399.99);
  `

const queryClient = useQueryClient()
const registry = useRegistry()

const dataSourceId =
  // find existing data source or create a new one
  registry.getDataSources().find((it) => {
    return it.identifier === 'home-page-hero-sqlite'
  })?.id ??
  registry.register({
    engine: DatabaseEngine.SQLite,
    driver: DataSourceDriver.SQLiteWASM,
    mode: DataSourceMode.Memory,
    displayName: 'SQLite',
    identifier: 'home-page-hero-sqlite',
    connectionString: '',
    fileAccessor: FileAccessor.Dummy,
  })
const model = monaco.editor.createModel(EDITOR_VALUE, 'sql')

registry.start(dataSourceId)
const isRunning = useIsRunning(dataSourceId)

const runner = registry.getRunner(dataSourceId)
const editor = useEditor({
  model,
  runner,
})
editor.use(inlineRun({ enabled: isRunning }))
editor.use(highlightSelected)
editor.editor.setScrollTop(70)

whenever(isRunning, async () => {
  const [insertValues] = StatementExtractor.fromValue(INSERT_VALUES).extract()
  const [createTable, ...rest] = editor.statements.value
  const statements = [createTable, insertValues, ...rest]
  await runner.asyncBatch(statements)
  await queryClient.invalidateQueries({
    queryKey: ['schemaTree'],
  })
})
</script>

<template>
  <div class="border rounded-md overflow-hidden">
    <ResizablePanelGroup direction="vertical">
      <ResizablePanel>
        <MonacoEditor :editor="editor" />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>
        <ConsoleResultPanel :data-source-id="dataSourceId" />
      </ResizablePanel>
    </ResizablePanelGroup>
  </div>
</template>

<script setup lang="ts">
import { useRegistry } from '@/composables/useRegistry'
import { DatabaseEngine } from '@/lib/engines/enums'
import { DataSourceMode } from '@/lib/dataSources/enums'
import { getExampleSql } from '@/lib/examples/getExampleSql'
import * as monaco from 'monaco-editor'
import { useIsRunning } from '@/composables/useIsRunning'
import { getStatements, useEditor } from '@/composables/editor/useEditor'
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

const queryClient = useQueryClient()
const registry = useRegistry()

const dataSourceKey = registry.register({
  engine: DatabaseEngine.SQLite,
  mode: DataSourceMode.Memory,
  identifier: 'default',
})
const model = monaco.editor.createModel(
  getExampleSql(DatabaseEngine.SQLite),
  'sql',
)

registry.start(dataSourceKey)
const isRunning = useIsRunning(dataSourceKey)

const runner = registry.getRunner(dataSourceKey)
const editor = useEditor({
  model,
  runner,
  getStatements,
})
editor.use(inlineRun({ enabled: isRunning }))
editor.use(highlightSelected)
editor.editor.setScrollTop(100)

whenever(isRunning, () => {
  runner.batch(editor.statements.value, true)
  queryClient.invalidateQueries({
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
        <ConsoleResultPanel :data-source-key="dataSourceKey" />
      </ResizablePanel>
    </ResizablePanelGroup>
  </div>
</template>

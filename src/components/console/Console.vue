<script setup lang="ts">
import Editor from '@/components/shared/monaco/MonacoEditor.vue'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import ConsoleResultPanel from '@/components/console/ConsoleResultPanel.vue'
import ConsoleToolbar from '@/components/console/ConsoleToolbar.vue'
import * as monaco from 'monaco-editor'
import { useExec } from '@/composables/useExec'
import type { DatabaseFacade } from '@/lib/databases/database'

const props = defineProps<{
  database: DatabaseFacade
  editorValue: string
  isInitializing: boolean
  loadingMessage: string
}>()

const model = monaco.editor.createModel(props.editorValue, 'sql')

const { exec, data, reset, isPending } = useExec(props.database)

function handleRunAll() {
  exec(model.getValue())
}

function handleRunStatement(sql: string) {
  exec(sql)
}

function handleClear() {
  model.setValue('')
  reset()
}
</script>

<template>
  <ResizablePanelGroup
    direction="vertical"
    auto-save-id="console-editor-result"
  >
    <ResizablePanel collapsible :min-size="10">
      <ConsoleToolbar
        @run="handleRunAll"
        @clear="handleClear"
        :disable-run="isInitializing || isPending"
      />
      <Editor :model="model" @run-statement="handleRunStatement" />
    </ResizablePanel>
    <ResizableHandle />
    <ResizablePanel collapsible :default-size="24" :min-size="10">
      <div class="h-full">
        <ConsoleResultPanel :data="data" :logger="database.getLogger()" />
      </div>
    </ResizablePanel>
  </ResizablePanelGroup>
</template>

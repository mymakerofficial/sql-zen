<script setup lang="ts">
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import EditorResultPanel from '@/components/editor/EditorResultPanel.vue'
import EditorToolbar from '@/components/editor/EditorToolbar.vue'
import * as monaco from 'monaco-editor'
import type { DatabaseFacade } from '@/lib/databases/database'
import { getStatements, useEditor } from '@/composables/editor/useEditor'
import inlineRun from '@/composables/editor/inlineRun'
import { Runner } from '@/lib/runner/runner'
import inlineResults from '@/composables/editor/inlineResults'
import MonacoEditor from '@/components/shared/monaco/MonacoEditor.vue'
import { useStorage } from '@vueuse/core'
import DatabaseExplorerPanel from '@/components/DatabaseExplorerPanel.vue'

const props = defineProps<{
  database: DatabaseFacade
  initValue: string
}>()

const model = monaco.editor.createModel(props.initValue, 'sql')

const enableInlineResults = useStorage('enable-inline-results', false)

const runner = new Runner(props.database)
const editor = useEditor({
  model,
  runner,
  getStatements,
})
editor.use(inlineRun)
editor.use(inlineResults({ enabled: enableInlineResults }))

function handleRunAll() {
  runner.push(editor.statements.value)
}

function handleClear() {
  model.setValue('')
  runner.clear()
}
</script>

<template>
  <ResizablePanelGroup direction="horizontal">
    <ResizablePanel :default-size="18">
      <DatabaseExplorerPanel />
    </ResizablePanel>
    <ResizableHandle />
    <ResizablePanel>
      <ResizablePanelGroup direction="vertical">
        <ResizablePanel>
          <EditorToolbar
            @run="handleRunAll"
            @clear="handleClear"
            v-model:enable-inline-results="enableInlineResults"
          />
          <MonacoEditor :editor="editor" />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel :default-size="33">
          <EditorResultPanel
            :runner="runner"
            :show-results="!enableInlineResults"
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </ResizablePanel>
  </ResizablePanelGroup>
</template>

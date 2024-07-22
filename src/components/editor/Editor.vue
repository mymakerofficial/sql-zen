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
import { ref } from 'vue'
import inlineRun from '@/composables/editor/inlineRun'
import { Runner } from '@/lib/runner/runner'
import inlineResults from '@/composables/editor/inlineResults'
import MonacoEditor from '@/components/shared/monaco/MonacoEditor.vue'

const props = defineProps<{
  database: DatabaseFacade
  initValue: string
  isInitializing: boolean
}>()

const model = monaco.editor.createModel(props.initValue, 'sql')

const enableInlineResults = ref(false)

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
  <ResizablePanelGroup
    direction="vertical"
    auto-save-id="console-editor-result"
  >
    <ResizablePanel collapsible :min-size="10">
      <EditorToolbar
        @run="handleRunAll"
        @clear="handleClear"
        :disable-run="isInitializing"
        v-model:enable-inline-results="enableInlineResults"
      />
      <MonacoEditor :editor="editor" />
    </ResizablePanel>
    <ResizableHandle />
    <ResizablePanel collapsible :default-size="24" :min-size="10">
      <div class="h-full">
        <EditorResultPanel
          :runner="runner"
          :show-results="!enableInlineResults"
        />
      </div>
    </ResizablePanel>
  </ResizablePanelGroup>
</template>

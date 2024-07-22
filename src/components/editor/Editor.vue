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
import { computed, ref } from 'vue'
import inlineRun from '@/composables/editor/inlineRun'
import { isSuccessful, Runner } from '@/lib/runner/runner'
import { useRunnerQueries } from '@/composables/useRunnerQueries'

const props = defineProps<{
  database: DatabaseFacade
  initValue: string
  isInitializing: boolean
}>()

const model = monaco.editor.createModel(props.initValue, 'sql')
const container = ref<HTMLElement | null>(null)

const runner = new Runner(props.database)
const editor = useEditor({
  model,
  runner,
  getStatements,
})
editor.use(inlineRun)
editor.mount(container)

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
      />
      <!--      <MonacoEditor :model="model" :run-handler="execAsync" />-->
      <div ref="container" class="w-full h-full"></div>
    </ResizablePanel>
    <ResizableHandle />
    <ResizablePanel collapsible :default-size="24" :min-size="10">
      <div class="h-full">
        <EditorResultPanel :runner="runner" />
      </div>
    </ResizablePanel>
  </ResizablePanelGroup>
</template>

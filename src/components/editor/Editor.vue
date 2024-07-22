<script setup lang="ts">
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import EditorResultPanel from '@/components/editor/EditorResultPanel.vue'
import EditorToolbar from '@/components/editor/EditorToolbar.vue'
import * as monaco from 'monaco-editor'
import { useExec } from '@/composables/useExec'
import type { DatabaseFacade } from '@/lib/databases/database'
import { useEditor } from '@/composables/editor/useEditor'
import { computed, ref } from 'vue'
import inlineRun from '@/composables/editor/inlineRun'
import { useEditorValue } from '@/composables/editor/useEditorValue'
import { findStatements } from '@/lib/statements'

const props = defineProps<{
  database: DatabaseFacade
  initValue: string
  isInitializing: boolean
}>()

const model = monaco.editor.createModel(props.initValue, 'sql')

const { exec, execAsync, data, reset, isPending } = useExec(props.database)

const editor = useEditor({
  model,
})
const editorValue = useEditorValue(editor.editor)
const statements = computed(() => findStatements(editorValue.value))
editor.use(inlineRun({ statements, runHandler: execAsync }))

const container = ref<HTMLElement | null>(null)

editor.mount(container)

function handleRunAll() {
  exec(model.getValue())
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
      <EditorToolbar
        @run="handleRunAll"
        @clear="handleClear"
        :disable-run="isInitializing || isPending"
      />
      <!--      <MonacoEditor :model="model" :run-handler="execAsync" />-->
      <div ref="container" class="w-full h-full"></div>
    </ResizablePanel>
    <ResizableHandle />
    <ResizablePanel collapsible :default-size="24" :min-size="10">
      <div class="h-full">
        <EditorResultPanel :data="data" :logger="database.getLogger()" />
      </div>
    </ResizablePanel>
  </ResizablePanelGroup>
</template>

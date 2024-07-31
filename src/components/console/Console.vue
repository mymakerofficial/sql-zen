<script setup lang="ts">
import MonacoEditor from '@/components/shared/monaco/MonacoEditor.vue'
import ConsoleToolbar from '@/components/console/ConsoleToolbar.vue'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import ConsoleResultPanel from '@/components/console/ConsoleResultPanel.vue'
import { getStatements, useEditor } from '@/composables/editor/useEditor'
import inlineRun from '@/composables/editor/inlineRun'
import inlineResults from '@/composables/editor/inlineResults'
import * as monaco from 'monaco-editor'
import { useMediaQuery, useStorage } from '@vueuse/core'
import { useRegistry } from '@/composables/useRegistry'
import { getExampleSql } from '@/lib/examples/getExampleSql'
import highlightSelected from '@/composables/editor/highlightSelected'
import { useIsRunning } from '@/composables/useIsRunning'

const props = defineProps<{
  dataSourceKey: string
}>()

const showGlyphMargin = useMediaQuery('(min-width: 768px)') // md
const enableInlineResults = useStorage('enable-inline-results', false)

const registry = useRegistry()
const runner = registry.getRunner(props.dataSourceKey)
const isRunning = useIsRunning(props.dataSourceKey)
const model = monaco.editor.createModel(
  getExampleSql(runner.getDataSource().getEngine()),
  'sql',
)
const editor = useEditor({
  model,
  runner,
  glyphMargin: showGlyphMargin,
  getStatements,
})
editor.use(inlineRun({ enabled: isRunning }))
editor.use(inlineResults({ enabled: enableInlineResults }))
editor.use(highlightSelected)

// temporary store the model content in local storage
const modelStorage = useStorage(
  `editor-model-${props.dataSourceKey}-sql`,
  model.getValue(),
)
model.setValue(modelStorage.value)
model.onDidChangeContent(() => {
  modelStorage.value = model.getValue()
})
</script>

<template>
  <ResizablePanelGroup direction="vertical">
    <ResizablePanel>
      <ConsoleToolbar
        :runner="runner"
        :editor="editor"
        v-model:enable-inline-results="enableInlineResults"
      />
      <MonacoEditor :editor="editor" />
    </ResizablePanel>
    <ResizableHandle />
    <ResizablePanel :default-size="33">
      <ConsoleResultPanel
        :runner="runner"
        :show-results="!enableInlineResults"
      />
    </ResizablePanel>
  </ResizablePanelGroup>
</template>

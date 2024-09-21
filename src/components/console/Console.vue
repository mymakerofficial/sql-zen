<script setup lang="ts">
import MonacoEditor from '@/components/shared/monaco/MonacoEditor.vue'
import ConsoleToolbar from '@/components/console/ConsoleToolbar.vue'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import ConsoleResultPanel from '@/components/console/ConsoleResultPanel.vue'
import { useEditor } from '@/composables/editor/useEditor'
import inlineRun from '@/composables/editor/inlineRun'
import * as monaco from 'monaco-editor'
import { useStorage } from '@vueuse/core'
import { useRegistry } from '@/composables/useRegistry'
import highlightSelected from '@/composables/editor/highlightSelected'
import { useIsRunning } from '@/composables/useIsRunning'
import { ref } from 'vue'
import { useEditorCursorPosition } from '@/composables/editor/useEditorCursorPosition'

const props = defineProps<{
  dataSourceKey: string
  model: monaco.editor.ITextModel
}>()

const enableInlineResults = useStorage('enable-inline-results', false)
const runTransacting = ref(true)

const registry = useRegistry()
const runner = registry.getRunner(props.dataSourceKey)
const isRunning = useIsRunning(props.dataSourceKey)
const editor = useEditor({
  model: props.model,
  runner,
})
editor.use(inlineRun({ enabled: isRunning }))
// editor.use(inlineResults({ enabled: enableInlineResults }))
editor.use(highlightSelected)

const cursor = useEditorCursorPosition(editor.editor)
const eol = ['LF', 'CRLF', '?'][
  editor.editor.getModel()?.getEndOfLineSequence() ?? 3
]
</script>

<template>
  <ResizablePanelGroup direction="vertical">
    <ResizablePanel class="relative">
      <ConsoleToolbar
        :runner="runner"
        :editor="editor"
        v-model:enable-inline-results="enableInlineResults"
        v-model:run-transacting="runTransacting"
      />
      <MonacoEditor :editor="editor" />
      <div
        class="flex gap-2 absolute bottom-0 right-0 p-2 bg-background text-muted-foreground text-xs border-l border-t border-border"
      >
        <span>{{ cursor }}</span>
        <span>{{ eol }}</span>
      </div>
    </ResizablePanel>
    <ResizableHandle />
    <ResizablePanel :default-size="33">
      <ConsoleResultPanel
        :data-source-key="dataSourceKey"
        :show-results="!enableInlineResults"
      />
    </ResizablePanel>
  </ResizablePanelGroup>
</template>

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
import { onMounted } from 'vue'
import * as monaco from 'monaco-editor'
import { useStorage } from '@vueuse/core'
import { type RegisteredReadyDatabase } from '@/lib/registry/registry'
import { useRegistry } from '@/composables/useRegistry'

const props = defineProps<{
  databaseKey: string
}>()

const enableInlineResults = useStorage('enable-inline-results', false)

const registry = useRegistry()
const { database, runner, ...info } = registry.getDatabase(
  props.databaseKey,
) as RegisteredReadyDatabase // let's just hope for the best
const model = monaco.editor.createModel('SELECT random();', 'sql')
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

onMounted(() => database.init())
</script>

<template>
  <ResizablePanelGroup direction="vertical">
    <ResizablePanel>
      <ConsoleToolbar
        :info="info"
        @run="handleRunAll"
        @clear="handleClear"
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

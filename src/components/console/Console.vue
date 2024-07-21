<script setup lang="ts">
import Editor from '@/components/shared/editor/MonacoEditor.vue'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import ConsoleResultPanel from '@/components/console/ConsoleResultPanel.vue'
import ConsoleToolbar from '@/components/console/ConsoleToolbar.vue'
import { LoaderCircleIcon } from 'lucide-vue-next'
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

const { exec, data, error, reset, isPending } = useExec(props.database)

function handleRun() {
  exec(model.getValue())
}

function handleClear() {
  model.setValue('')
  reset()
}
</script>

<template>
  <ResizablePanelGroup direction="vertical">
    <ResizablePanel>
      <ConsoleToolbar
        @run="handleRun"
        @clear="handleClear"
        :disable-run="isInitializing || isPending"
      />
      <Editor :model="model" />
    </ResizablePanel>
    <ResizableHandle />
    <ResizablePanel :default-size="24">
      <div
        v-if="isInitializing"
        class="h-24 flex items-center justify-center gap-2"
      >
        <LoaderCircleIcon class="size-5 animate-spin" />
        <span>{{ loadingMessage }}</span>
      </div>
      <div v-else class="h-full">
        <ConsoleResultPanel :data="data" :logger="database.getLogger()" />
      </div>
    </ResizablePanel>
  </ResizablePanelGroup>
</template>

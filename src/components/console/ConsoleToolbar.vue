<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  DownloadIcon,
  EraserIcon,
  FolderIcon,
  TableRowsSplitIcon,
} from 'lucide-vue-next'
import { Toggle } from '@/components/ui/toggle'
import type { UseEditor } from '@/composables/editor/useEditor'
import { downloadFile } from '@/lib/downloadFile'
import { computed } from 'vue'
import { Separator } from '@/components/ui/separator'
import type { IRunner } from '@/lib/runner/interface'
import { DatabaseEngine } from '@/lib/engines/enums'
import { useDialog } from '@/composables/useDialog'
import DuckDbExplorer from '@/components/shared/dialogs/duckDbExplorer/DuckDbExplorer.vue'
import { useQueryClient } from '@tanstack/vue-query'
import RunButton from '@/components/console/RunButton.vue'

const enableInlineResults = defineModel<boolean>('enableInlineResults')

const props = defineProps<{
  runner: IRunner
  editor: UseEditor
}>()

const queryClient = useQueryClient()
const { open: openFileExplorer } = useDialog(DuckDbExplorer)

const canOpenFileExplorer = computed(
  () => props.runner.getDataSource().getEngine() === DatabaseEngine.DuckDB,
)

const canDump = computed(
  () => props.runner.getDataSource().getEngine() !== DatabaseEngine.DuckDB,
)

function handleOpenFileExplorer() {
  openFileExplorer({ dataSourceKey: props.runner.getKey() })
}

async function handleDump() {
  const dump = await props.runner.getDataSource().dump()
  downloadFile(dump)
}

function handleClear() {
  props.editor.editor.getModel()?.setValue('')
  props.runner.clear()
  queryClient.invalidateQueries({
    queryKey: ['runnerQueries', props.runner.getKey()],
  })
}
</script>

<template>
  <section class="h-12 px-3 flex justify-between border-b border-border">
    <div class="h-full flex items-center gap-3">
      <RunButton :editor="editor" />
      <Separator orientation="vertical" />
      <Button
        v-if="canOpenFileExplorer"
        @click="handleOpenFileExplorer"
        size="sm"
        variant="ghost"
        class="gap-3"
      >
        <FolderIcon class="size-4 min-w-max" />
        <span class="hidden md:block">Explore Files</span>
      </Button>
      <Button
        v-if="canDump"
        @click="handleDump"
        size="sm"
        variant="ghost"
        class="gap-3"
      >
        <DownloadIcon class="size-4 min-w-max" />
        <span class="hidden md:block">Download Dump</span>
      </Button>
      <Separator orientation="vertical" />
      <Toggle v-model:pressed="enableInlineResults" class="gap-3 h-9">
        <TableRowsSplitIcon class="size-4 min-w-max" />
        <span class="hidden md:block">Inline Results</span>
      </Toggle>
    </div>
    <div class="h-full flex items-center">
      <Button @click="handleClear" size="sm" variant="ghost">
        <EraserIcon class="size-4 min-w-max" />
      </Button>
    </div>
  </section>
</template>

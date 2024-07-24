<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  EraserIcon,
  PlayIcon,
  TableRowsSplitIcon,
  DownloadIcon,
} from 'lucide-vue-next'
import { Toggle } from '@/components/ui/toggle'
import type { Runner } from '@/lib/runner/runner'
import type { UseEditor } from '@/composables/editor/useEditor'
import { downloadDump } from '@/lib/downloadBlob'
import { DatabaseEngine } from '@/lib/databaseEngines'
import { computed } from 'vue'
import { Separator } from '@/components/ui/separator'
import { SqlDialectFactory } from '@/lib/dialect/factory'

const enableInlineResults = defineModel<boolean>('enableInlineResults')

const props = defineProps<{
  runner: Runner
  editor: UseEditor
}>()

const canDump = computed(
  () => props.runner.getDataSource().engine !== DatabaseEngine.DuckDB,
)

function handleRun() {
  props.runner.run(props.editor.statements.value)
}

async function handleDump() {
  const dump = await props.runner.getDataSource().dump()
  downloadDump(dump)
}

function handleClear() {
  props.editor.editor.getModel()?.setValue('')
  props.runner.clear()
}
</script>

<template>
  <section class="h-12 px-3 flex justify-between border-b border-border">
    <div class="h-full flex items-center gap-3">
      <Button @click="handleRun" size="sm" variant="ghost" class="gap-3">
        <PlayIcon class="size-4 min-w-max" />
        <span>Run All</span>
      </Button>
      <Button
        v-if="canDump"
        @click="handleDump"
        size="sm"
        variant="ghost"
        class="gap-3"
      >
        <DownloadIcon class="size-4 min-w-max" />
        <span>Download Dump</span>
      </Button>
      <Separator orientation="vertical" />
      <Toggle v-model:pressed="enableInlineResults" class="gap-3 h-9">
        <TableRowsSplitIcon class="size-4 min-w-max" />
        <span>Inline Results</span>
      </Toggle>
    </div>
    <div class="h-full flex items-center">
      <Button @click="handleClear" size="sm" variant="ghost">
        <EraserIcon class="size-4 min-w-max" />
      </Button>
    </div>
  </section>
</template>

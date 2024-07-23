<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { EraserIcon, PlayIcon, TableRowsSplitIcon } from 'lucide-vue-next'
import { Toggle } from '@/components/ui/toggle'
import type { DatabaseInfo } from '@/lib/databases/databaseFactory'

const enableInlineResults = defineModel<boolean>('enableInlineResults')

defineProps<{
  info: DatabaseInfo
  disableRun?: boolean
}>()

const emit = defineEmits<{
  run: []
  clear: []
}>()

function handleRun() {
  emit('run')
}

function handleClear() {
  emit('clear')
}
</script>

<template>
  <section class="h-12 px-3 flex justify-between border-b border-border">
    <div class="h-full flex items-center gap-3">
      <Button
        @click="handleRun"
        :disabled="disableRun"
        size="sm"
        variant="ghost"
        class="gap-3"
      >
        <PlayIcon class="size-4" />
        <span>Run All</span>
      </Button>
      <Toggle v-model:pressed="enableInlineResults" class="gap-3 h-9">
        <TableRowsSplitIcon class="size-4" />
        <span>Inline Results</span>
      </Toggle>
      <div class="p-3 text-sm text-muted-foreground">
        <p>
          {{ `${info.engine}:${info.mode}:${info.identifier}` }}
        </p>
      </div>
    </div>
    <div class="h-full flex items-center">
      <Button @click="handleClear" size="sm" variant="ghost">
        <EraserIcon class="size-4" />
      </Button>
    </div>
  </section>
</template>

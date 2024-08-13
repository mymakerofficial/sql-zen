<script setup lang="ts">
import { ArrowLeftRightIcon, TableRowsSplitIcon } from 'lucide-vue-next'
import { Toggle } from '@/components/ui/toggle'
import type { UseEditor } from '@/composables/editor/useEditor'
import { Separator } from '@/components/ui/separator'
import RunButton from '@/components/console/RunButton.vue'

const enableInlineResults = defineModel<boolean>('enableInlineResults')
const runTransacting = defineModel<boolean>('runTransacting')

defineProps<{
  editor: UseEditor
}>()
</script>

<template>
  <section
    class="min-h-12 h-12 px-3 flex justify-between gap-3 border-b border-border overflow-x-auto"
  >
    <div class="h-full flex items-center gap-3">
      <RunButton :editor="editor" :transacting="runTransacting" />
      <Separator orientation="vertical" />
      <Toggle v-model:pressed="runTransacting" class="gap-3 h-9">
        <ArrowLeftRightIcon class="size-4 min-h-max" />
        <span class="hidden md:block">Transaction</span>
      </Toggle>
      <Toggle v-model:pressed="enableInlineResults" class="gap-3 h-9">
        <TableRowsSplitIcon class="size-4 min-h-max" />
        <span class="hidden md:block">Inline Results</span>
      </Toggle>
    </div>
    <div class="h-full flex items-center"></div>
  </section>
</template>

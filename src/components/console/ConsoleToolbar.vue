<script setup lang="ts">
import { ArrowLeftRightIcon } from 'lucide-vue-next'
import { Toggle } from '@/components/ui/toggle'
import type { UseEditor } from '@/composables/editor/useEditor'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import RunButtonBar from '@/components/shared/runButton/RunButtonBar.vue'

// kept for future use
defineModel<boolean>('enableInlineResults')
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
      <RunButtonBar :editor="editor" :transacting="runTransacting" />
      <Separator orientation="vertical" />
      <Tooltip>
        <TooltipTrigger>
          <Toggle v-model:pressed="runTransacting" class="gap-3 h-9">
            <ArrowLeftRightIcon class="size-4" />
            <span class="hidden md:block">Transaction</span>
          </Toggle>
        </TooltipTrigger>
        <TooltipContent>
          When enabled, multiple queries are executed as a single transaction.
        </TooltipContent>
      </Tooltip>
    </div>
    <div class="h-full flex items-center"></div>
  </section>
</template>

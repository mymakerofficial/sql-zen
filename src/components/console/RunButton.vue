<script setup lang="ts">
import type { UseEditor } from '@/composables/editor/useEditor'
import { PlayIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import CodeBlock from '@/components/shared/CodeBlock.vue'
import { ref } from 'vue'
import highlightStatements from '@/composables/editor/highlightStatements'
import { useRunSuggestions } from '@/composables/editor/useRunSuggestions'
import type { Statement } from '@/lib/statements/interface'
import { useIsRunning } from '@/composables/useIsRunning'

const props = defineProps<{
  editor: UseEditor
  transacting?: boolean
}>()

const isRunning = useIsRunning(props.editor.runner?.getId() ?? '')
const suggestions = useRunSuggestions(props.editor)

const hovered = ref<Statement[]>([])
const isOpen = ref(false)

const highlightHovered = highlightStatements(hovered, {
  className: 'selected-statement-run-bg',
  inlineClassName: 'selected-statement-run',
})

props.editor.use(highlightHovered)

function close() {
  hovered.value = []
  isOpen.value = false
}

function handleHover(statements: Statement[]) {
  hovered.value = statements
}

function handleRun(statements: Statement[]) {
  close()
  props.editor.runner?.batch(statements, props.transacting)
}
</script>

<template>
  <Popover v-model:open="isOpen">
    <PopoverTrigger>
      <Button
        :disabled="!isRunning"
        size="sm"
        variant="success"
        class="gap-3"
        aria-label="Select statement to run"
      >
        <PlayIcon class="size-4" />
        <span>Run</span>
      </Button>
    </PopoverTrigger>
    <PopoverContent
      align="start"
      class="p-1 relative -top-10 w-96 flex flex-col gap-1"
      @mouseleave="close"
    >
      <Button
        v-for="suggestion in suggestions"
        :key="suggestion.key"
        @click="() => handleRun(suggestion.statements)"
        @mouseenter="() => handleHover(suggestion.statements)"
        @mouseleave="() => handleHover([])"
        size="sm"
        variant="ghost"
        class="w-full py-2 h-fit max-h-16 justify-start items-start overflow-hidden"
        :aria-label="`Run Statement: ${suggestion.short.substring(0, 10)}`"
      >
        <CodeBlock
          :code="suggestion.short"
          class="text-start [&_pre]:!bg-transparent"
        />
      </Button>
    </PopoverContent>
  </Popover>
</template>

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

const props = defineProps<{
  editor: UseEditor
}>()

const suggestions = useRunSuggestions(props.editor)

const hovered = ref<Statement[]>([])
const open = ref(false)

props.editor.use(
  highlightStatements(hovered, {
    className: 'selected-statement-run-bg',
    inlineClassName: 'selected-statement-run',
  }),
)

function handleHover(statements: Statement[]) {
  hovered.value = statements
}

function handleRun(statements: Statement[]) {
  open.value = false
  hovered.value = []
  props.editor.runner?.batch(statements)
}
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger>
      <Button size="sm" variant="success" class="gap-3">
        <PlayIcon class="size-4 min-w-max" />
        <span class="hidden md:block">Run</span>
      </Button>
    </PopoverTrigger>
    <PopoverContent
      align="start"
      class="p-1 relative -top-10 w-96 flex flex-col gap-1"
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
      >
        <CodeBlock
          :code="suggestion.short"
          class="text-start [&_pre]:!bg-transparent"
        />
      </Button>
    </PopoverContent>
  </Popover>
</template>

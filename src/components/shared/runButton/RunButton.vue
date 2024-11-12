<script setup lang="ts">
import type { UseEditor } from '@/composables/editor/useEditor'
import {
  ChevronDownIcon,
  FastForwardIcon,
  PlayIcon,
  StepForwardIcon,
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { computed, ref, toValue } from 'vue'
import highlightStatements from '@/composables/editor/highlightStatements'
import { useIsRunning } from '@/composables/useIsRunning'
import {
  useStatementsAfterSelected,
  useStatementsInSelection,
} from '@/composables/editor/useSelectedStatement'
import { useElementHover } from '@vueuse/core'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { PopoverAnchor } from 'radix-vue'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from '@/components/ui/command'
import {
  RunButtonMode,
  type RunButtonModeOption,
} from '@/components/shared/runButton/types'
import RunButtonModeItem from '@/components/shared/runButton/RunButtonModeItem.vue'

const selectedMode = defineModel<RunButtonMode>('mode', {
  default: RunButtonMode.RunSelected,
})

const props = defineProps<{
  editor: UseEditor
  transacting?: boolean
  omitMode?: RunButtonMode | undefined
}>()

const runButton = ref<HTMLButtonElement>()
const isHovered = useElementHover(runButton)
const popoverOpen = ref(false)

const isRunning = useIsRunning(() => props.editor.runner?.dataSource.id ?? '')

const statementsInSelection = useStatementsInSelection(props.editor)
const statementsAfterSelected = useStatementsAfterSelected(props.editor)
const allStatements = props.editor.statements

const options: {
  [key in RunButtonMode]: RunButtonModeOption
} = {
  [RunButtonMode.RunSelected]: {
    label: 'Run Selected',
    description: 'Run the selected statement(s) in the editor.',
    value: RunButtonMode.RunSelected,
    icon: PlayIcon,
    statements: statementsInSelection,
  },
  [RunButtonMode.RunSelectedDown]: {
    label: 'Run Cursor Down',
    description: 'Run the selected statement(s) and all statements below.',
    value: RunButtonMode.RunSelectedDown,
    icon: StepForwardIcon,
    statements: statementsAfterSelected,
  },
  [RunButtonMode.RunAll]: {
    label: 'Run All',
    description: 'Run all statements in the editor.',
    value: RunButtonMode.RunAll,
    icon: FastForwardIcon,
    statements: allStatements,
  },
}
const filteredOptions = computed(() => {
  return Object.values(options).filter(
    (option) => option.value !== props.omitMode,
  )
})

const mode = computed(() => options[selectedMode.value])

const statements = computed(() => toValue(mode.value.statements))

const highlightedStatements = computed(() => {
  if (isHovered.value) {
    return statements.value
  }

  return []
})
const highlightHovered = highlightStatements(highlightedStatements, {
  className: 'selected-statement-run-bg',
  inlineClassName: 'selected-statement-run',
})
props.editor.use(highlightHovered)

const enabled = computed(() => isRunning.value && statements.value.length > 0)

function handleSelectMode(value: RunButtonMode) {
  selectedMode.value = value
  popoverOpen.value = false
}

function handleRun() {
  close()
  props.editor.runner?.batch(statements.value, props.transacting)
}
</script>

<template>
  <Popover v-model:open="popoverOpen">
    <PopoverAnchor as-child>
      <div class="flex gap-0.5">
        <Tooltip>
          <TooltipTrigger as-child>
            <Button
              @click="handleRun"
              ref="runButton"
              :disabled="!enabled"
              size="sm"
              variant="success"
              class="gap-3 rounded-r-none"
            >
              <Component :is="mode.icon" class="size-4" />
              <span>{{ mode.label }}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {{ mode.description }}
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger as-child>
            <PopoverTrigger as-child>
              <Button
                :disabled="!isRunning"
                size="sm"
                variant="success"
                class="w-8 p-0 rounded-l-none"
                aria-label="Select statement to run"
              >
                <ChevronDownIcon class="size-4" />
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent> Change the run button behavior. </TooltipContent>
        </Tooltip>
      </div>
    </PopoverAnchor>
    <PopoverContent class="p-0">
      <Command @mouseleave="popoverOpen = false">
        <CommandInput class="h-9" placeholder="Select run button mode..." />
        <CommandEmpty><i>*crickets*</i></CommandEmpty>
        <CommandList>
          <CommandGroup>
            <RunButtonModeItem
              v-for="option in filteredOptions"
              :key="option.value"
              :option="option"
              :editor="props.editor"
              @select="(_e) => handleSelectMode(option.value)"
            />
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>

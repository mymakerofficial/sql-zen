<script setup lang="ts">
import type { UseEditor } from '@/composables/editor/useEditor'
import {
  ChevronDownIcon,
  FastForwardIcon,
  PlayIcon,
  StepForwardIcon,
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { computed, nextTick, ref, toValue } from 'vue'
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

const mode = defineModel<RunButtonMode>('mode', {
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

// whatever mode was last hovered
const selectedMode = ref<RunButtonMode>(mode.value)

// data from options based on the selected mode
const modeData = computed(() => options[mode.value])

// the statements to run based on the selected mode
const statements = computed(() => toValue(modeData.value.statements))

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
  mode.value = value
  // wait for vue to update then run using the new mode
  nextTick(() => {
    handleRun()
  })
}

function handleRun() {
  popoverOpen.value = false
  if (!enabled.value) return
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
              <Component :is="modeData.icon" class="size-4" />
              <span>{{ modeData.label }}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {{ modeData.description }}
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
          <TooltipContent>
            More options for running statements.
          </TooltipContent>
        </Tooltip>
      </div>
    </PopoverAnchor>
    <PopoverContent class="p-0">
      <Command
        v-model:selected-value="selectedMode"
        @mouseleave="popoverOpen = false"
      >
        <CommandInput
          class="h-9"
          placeholder="Select what statements to run..."
        />
        <CommandEmpty><i>*crickets*</i></CommandEmpty>
        <CommandList>
          <CommandGroup>
            <RunButtonModeItem
              v-for="option in filteredOptions"
              :key="option.value"
              :option="option"
              :editor="props.editor"
              :is-selected="option.value === selectedMode"
              @select="(_e) => handleSelectMode(option.value)"
            />
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>

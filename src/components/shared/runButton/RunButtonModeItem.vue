<script setup lang="ts">
import { CommandItem } from '@/components/ui/command'
import { computed, ref, toValue } from 'vue'
import type { RunButtonModeOption } from '@/components/shared/runButton/types'
import type { UseEditor } from '@/composables/editor/useEditor'
import { useElementHover } from '@vueuse/core'
import highlightStatements from '@/composables/editor/highlightStatements'

const props = defineProps<{
  option: RunButtonModeOption
  editor: UseEditor
}>()

const el = ref<HTMLElement>()
const isHovered = useElementHover(el)

const highlightedStatements = computed(() => {
  if (isHovered.value) {
    return toValue(props.option.statements)
  }

  return []
})
const highlightHovered = highlightStatements(highlightedStatements, {
  className: 'selected-statement',
  inlineClassName: 'selected-statement-run',
})
props.editor.use(highlightHovered)
</script>

<template>
  <CommandItem ref="el" :value="option.value">
    <span class="grid gap-x-3 gap-y-1 p-0.5">
      <Component :is="option.icon" class="size-4" />
      <span>{{ option.label }}</span>
      <span class="col-start-2 text-muted-foreground text-xs">
        {{ option.description }}
      </span>
    </span>
  </CommandItem>
</template>

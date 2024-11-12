<script setup lang="ts">
import RunButton from '@/components/shared/runButton/RunButton.vue'
import type { UseEditor } from '@/composables/editor/useEditor'
import { useStorage } from '@vueuse/core'
import { RunButtonMode } from '@/components/shared/runButton/types'
import { useEnv } from '@/composables/useEnv'

const props = defineProps<{
  editor: UseEditor
  transacting?: boolean
}>()

const { isMediumScreen } = useEnv()

const primaryMode = useStorage<RunButtonMode>(
  'sql-zen-run-button-mode-primary',
  RunButtonMode.RunSelected,
)
const secondaryMode = useStorage<RunButtonMode>(
  'sql-zen-run-button-mode-secondary',
  RunButtonMode.RunAll,
)
</script>

<template>
  <div class="flex gap-3 items-center">
    <RunButton
      v-bind="props"
      v-model:mode="primaryMode"
      :omit-mode="isMediumScreen ? secondaryMode : undefined"
    />
    <RunButton
      v-if="isMediumScreen"
      v-bind="props"
      v-model:mode="secondaryMode"
      :omit-mode="primaryMode"
    />
  </div>
</template>

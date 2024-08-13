<script setup lang="ts">
import { PlayIcon } from 'lucide-vue-next'
import Console from '@/components/console/Console.vue'
import { useRegistry } from '@/composables/useRegistry'
import { watchEffect } from 'vue'
import { Button } from '@/components/ui/button'
import { useDataSourceInfo } from '@/composables/dataSources/useDataSourceInfo'
import { DataSourceStatus } from '@/lib/dataSources/enums'
import * as monaco from 'monaco-editor'

const props = defineProps<{
  dataSourceKey: string
  model: monaco.editor.ITextModel
  autoStart?: boolean
}>()

const registry = useRegistry()
const dataSourceInfo = useDataSourceInfo(props.dataSourceKey)

function handleStart() {
  registry.start(props.dataSourceKey)
}

watchEffect(() => {
  if (props.autoStart) {
    handleStart()
  }
})
</script>

<template>
  <div
    v-if="dataSourceInfo.status === DataSourceStatus.Stopped"
    class="flex flex-col items-center justify-center gap-4 flex-1"
  >
    <p class="text-muted-foreground">
      {{ dataSourceInfo.displayName }} is stopped
    </p>
    <Button @click="handleStart" variant="ghost" class="gap-3">
      <PlayIcon class="size-4 min-h-max" />
      <span>Start</span>
    </Button>
  </div>
  <div v-else class="flex-1">
    <Console
      :data-source-key="dataSourceKey"
      :model="model"
      :key="dataSourceKey"
    />
  </div>
</template>

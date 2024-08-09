<script setup lang="ts">
import { useDataSourceStatus } from '@/composables/useDataSourceStatus'
import { DataSourceStatus } from '@/lib/registry/enums'
import { PlayIcon } from 'lucide-vue-next'
import Console from '@/components/console/Console.vue'
import { useRegistry } from '@/composables/useRegistry'
import { watchEffect } from 'vue'
import { useDataSourceDisplayName } from '@/composables/useDataSourceDisplayName'
import { Button } from '@/components/ui/button'

const props = defineProps<{
  dataSourceKey: string
  autoStart?: boolean
}>()

const registry = useRegistry()
const status = useDataSourceStatus(props.dataSourceKey)
const displayName = useDataSourceDisplayName(props.dataSourceKey)

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
    v-if="status === DataSourceStatus.Stopped"
    class="flex flex-col items-center justify-center gap-4 flex-1"
  >
    <p class="text-muted-foreground">{{ displayName }} is stopped</p>
    <Button @click="handleStart" variant="ghost" class="gap-3">
      <PlayIcon class="size-4 min-w-max" />
      <span>Start</span>
    </Button>
  </div>
  <div v-else class="flex-1">
    <Console :data-source-key="dataSourceKey" :key="dataSourceKey" />
  </div>
</template>

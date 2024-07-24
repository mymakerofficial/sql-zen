<script setup lang="ts">
import {
  PlusIcon,
  SquareTerminalIcon,
  BlocksIcon,
  DatabaseIcon,
  TableIcon,
  RefreshCwIcon,
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import DatabaseEngineSelect from '@/components/shared/databaseEngineSelect/DatabaseEngineSelect.vue'
import { type DatabaseEngine, databaseEngines } from '@/lib/databaseEngines'
import { type DataSource, DataSourceState } from '@/lib/registry/registry'
import { useDataSources } from '@/composables/useDataSources'
import type { DataSourceInfo } from '@/lib/databases/dataSourceFactory'
import { useRegistry } from '@/composables/useRegistry'
import { useDialog } from '@/composables/useDialog'
import CreateDataSourceDialog from '@/components/shared/dialogs/CreateDataSourceDialog.vue'
import SchemaTree from '@/components/editor/SchemaTree.vue'
import { useQueryClient } from '@tanstack/vue-query'

const selected = defineModel<string | null>('selected', {
  required: true,
  default: null,
})

const { open: openCreate } = useDialog(CreateDataSourceDialog)
const queryClient = useQueryClient()
const registry = useRegistry()
const dataSources = useDataSources()

function getEngine(database: DataSourceInfo) {
  return databaseEngines[database.engine]
}

function handleCreate(engine: DatabaseEngine) {
  openCreate({
    engine,
  })
}

function handleSelect(database: DataSource) {
  registry.wake(database.key)
  selected.value = database.key
}

function handleRefresh() {
  queryClient.invalidateQueries({
    queryKey: ['schemaTree'],
  })
}
</script>

<template>
  <section class="flex flex-col">
    <div
      class="px-3 h-12 flex items-center justify-between border-b border-border"
    >
      <DatabaseEngineSelect @select="handleCreate">
        <Button size="sm" variant="ghost" class="gap-3">
          <PlusIcon class="size-4 min-w-max" />
          <span>Add Data Source</span>
        </Button>
      </DatabaseEngineSelect>
      <Button @click="handleRefresh" size="sm" variant="ghost">
        <RefreshCwIcon class="size-4 min-w-max" />
      </Button>
    </div>
    <div
      v-for="dataSource in dataSources"
      :key="dataSource.key"
      class="py-4 pl-6 pr-3 flex flex-col"
    >
      <div class="flex items-center justify-between text-sm">
        <Button
          @click="() => handleSelect(dataSource)"
          size="sm"
          variant="ghost"
          class="-ml-3 gap-3 items-center"
        >
          <span class="relative min-w-max">
            <img
              :src="getEngine(dataSource).icon"
              :alt="`${getEngine(dataSource).name} icon`"
              class="size-4 min-w-max text-muted-foreground"
            />
            <span
              :data-state="dataSource.state"
              class="block absolute -top-1 -right-1 size-1.5 rounded-full data-[state=ready]:bg-green-500 data-[state=stopped]:bg-red-500"
            />
          </span>
          <span class="font-medium">{{
            !dataSource.identifier
              ? `${getEngine(dataSource).name}`
              : `${dataSource.identifier}`
          }}</span>
        </Button>
        <div class="flex items-center mx-3">
          <SquareTerminalIcon
            v-if="selected === dataSource.key"
            class="size-4 min-w-max text-muted-foreground"
          />
        </div>
      </div>
      <SchemaTree
        v-if="dataSource.state === DataSourceState.Ready"
        :data-source="dataSource.dataSource"
        class="ml-1"
      />
    </div>
  </section>
</template>

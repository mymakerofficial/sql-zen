<script setup lang="ts">
import { PlusIcon, SquareTerminalIcon, BlocksIcon, DatabaseIcon, TableIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import DatabaseEngineSelect from '@/components/shared/databaseEngineSelect/DatabaseEngineSelect.vue'
import { type DatabaseEngine, databaseEngines } from '@/lib/databaseEngines'
import { type DataSource } from '@/lib/registry/registry'
import { useDataSources } from '@/composables/useDataSources'
import type { DataSourceInfo } from '@/lib/databases/dataSourceFactory'
import { useRegistry } from '@/composables/useRegistry'
import { useDialog } from '@/composables/useDialog'
import CreateDataSourceDialog from '@/components/shared/dialogs/CreateDataSourceDialog.vue'

const selected = defineModel<string | null>('selected', {
  required: true,
  default: null,
})

const { open: openCreate } = useDialog(CreateDataSourceDialog)
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
</script>

<template>
  <section class="flex flex-col">
    <div class="px-3 h-12 flex items-center border-b border-border">
      <DatabaseEngineSelect @select="handleCreate">
        <Button size="sm" variant="ghost" class="gap-3">
          <PlusIcon class="size-4" />
          <span>Add Data Source</span>
        </Button>
      </DatabaseEngineSelect>
    </div>
    <div>
      <div
        v-for="dataSource in dataSources"
        :key="dataSource.key"
        class="py-4 pl-6 pr-3 flex flex-col gap-4"
      >
        <div class="flex items-center justify-between text-sm">
          <Button
            @click="() => handleSelect(dataSource)"
            size="sm"
            variant="ghost"
            class="-ml-3 gap-3 items-center"
          >
            <span class="relative">
              <img
                :src="getEngine(dataSource).icon"
                :alt="`${getEngine(dataSource).name} icon`"
                class="size-4 text-muted-foreground"
              />
              <span
                :data-state="dataSource.state"
                class="block absolute -top-1 -right-1 size-1.5 rounded-full data-[state=ready]:bg-green-500 data-[state=stopped]:bg-red-500"
              />
            </span>
            <span class="font-medium">{{
              !dataSource.identifier ? `${getEngine(dataSource).name} (${dataSource.mode})` : `${dataSource.mode}:${dataSource.identifier}`
            }}</span>
          </Button>
          <div class="flex items-center mx-3">
            <SquareTerminalIcon
              v-if="selected === dataSource.key"
              class="size-4 text-muted-foreground"
            />
          </div>
        </div>
        <div v-if="selected === dataSource.key" class="ml-7 flex flex-col gap-4">
          <div class="flex flex-col gap-4">
            <p class="flex gap-3 items-center text-sm">
              <DatabaseIcon class="size-4 text-blue-500" />
              <span class="font-medium">public</span>
            </p>
            <div class="ml-7 flex flex-col gap-4">
              <p class="flex gap-3 items-center text-sm">
                <BlocksIcon class="size-4 text-muted-foreground" />
                <span class="font-medium">information_schema</span>
              </p>
              <p class="flex gap-3 items-center text-sm">
                <BlocksIcon class="size-4 text-muted-foreground" />
                <span class="font-medium">main</span>
              </p>
              <div class="ml-7 flex flex-col gap-4">
                <p class="flex gap-3 items-center text-sm">
                  <TableIcon class="size-4 text-blue-500" />
                  <span class="font-medium">tables</span>
                </p>
                <div class="ml-7">
                  <p class="text-muted-foreground text-sm">No tables...</p>
                </div>
              </div>
            </div>
            <p class="flex gap-3 items-center text-sm">
              <DatabaseIcon class="size-4 text-blue-500" />
              <span class="font-medium">system</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { PlusIcon, RefreshCwIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import DatabaseEngineSelect from '@/components/shared/databaseEngineSelect/DatabaseEngineSelect.vue'
import { useDataSources } from '@/composables/useDataSources'
import { useRegistry } from '@/composables/useRegistry'
import { useDialog } from '@/composables/useDialog'
import CreateDataSourceDialog from '@/components/shared/dialogs/CreateDataSourceDialog.vue'
import { useQueryClient } from '@tanstack/vue-query'
import type { DatabaseEngine } from '@/lib/engines/enums'
import DatabaseExplorerItem from '@/components/databaseExplorer/DatabaseExplorerItem.vue'

const selected = defineModel<string | null>('selected', {
  required: true,
  default: null,
})

const { open: openCreate } = useDialog(CreateDataSourceDialog)
const queryClient = useQueryClient()
const registry = useRegistry()
const dataSources = useDataSources()

function handleCreate(engine: DatabaseEngine) {
  openCreate({
    engine,
  })
}

function handleDelete(key: string) {
  registry.unregister(key)
}

function handleSelect(key: string) {
  registry.start(key)
  selected.value = key
}

function handleRefresh() {
  queryClient.invalidateQueries({
    queryKey: ['schemaTree'],
  })
}
</script>

<template>
  <section class="flex-1 flex flex-col h-full">
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
    <div class="flex-1 flex flex-col overflow-auto">
      <DatabaseExplorerItem
        v-for="dataSource in dataSources"
        :key="dataSource"
        :data-source-key="dataSource"
        :is-active="dataSource === selected"
        @select="() => handleSelect(dataSource)"
        @delete="() => handleDelete(dataSource)"
      />
    </div>
  </section>
</template>

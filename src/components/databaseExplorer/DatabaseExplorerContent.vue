<script setup lang="ts">
import DatabaseExplorerItem from '@/components/databaseExplorer/DatabaseExplorerItem.vue'
import { useRegistry } from '@/composables/useRegistry'
import { TabType } from '@/lib/tabs/enums'
import { useTabManager } from '@/composables/tabs/useTabManager'
import { useDataSourceIds } from '@/composables/dataSources/useDataSourceIds'

const registry = useRegistry()
const tabManager = useTabManager()
const dataSources = useDataSourceIds()

function handleDelete(id: string) {
  registry.unregister(id)
}

function handleSelect(id: string) {
  tabManager.createTab({
    type: TabType.Console,
    dataSourceId: id,
  })
}
</script>

<template>
  <div class="flex-1 flex flex-col gap-4">
    <DatabaseExplorerItem
      v-for="dataSource in dataSources"
      :key="dataSource"
      :data-source-id="dataSource"
      @select="() => handleSelect(dataSource)"
      @delete="() => handleDelete(dataSource)"
    />
  </div>
</template>

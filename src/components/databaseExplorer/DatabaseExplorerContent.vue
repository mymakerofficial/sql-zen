<script setup lang="ts">
import DatabaseExplorerItem from '@/components/databaseExplorer/DatabaseExplorerItem.vue'
import { useRegistry } from '@/composables/useRegistry'
import { TabType } from '@/lib/tabs/enums'
import { useTabManager } from '@/composables/tabs/useTabManager'
import { useDataSourceKeys } from '@/composables/dataSources/useDataSourceKeys'

const registry = useRegistry()
const tabManager = useTabManager()
const dataSources = useDataSourceKeys()

function handleDelete(key: string) {
  registry.unregister(key)
}

function handleSelect(key: string) {
  tabManager.createTab({
    type: TabType.Console,
    dataSourceKey: key,
  })
}
</script>

<template>
  <div class="flex-1 flex flex-col gap-4">
    <DatabaseExplorerItem
      v-for="dataSource in dataSources"
      :key="dataSource"
      :data-source-key="dataSource"
      @select="() => handleSelect(dataSource)"
      @delete="() => handleDelete(dataSource)"
    />
  </div>
</template>

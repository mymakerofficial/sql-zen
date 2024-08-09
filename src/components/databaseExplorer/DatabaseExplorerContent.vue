<script setup lang="ts">
import DatabaseExplorerItem from '@/components/databaseExplorer/DatabaseExplorerItem.vue'
import { useDataSources } from '@/composables/useDataSources'
import { useRegistry } from '@/composables/useRegistry'
import { TabType } from '@/lib/tabs/enums'
import { useTabManager } from '@/composables/useTabManager'

const registry = useRegistry()
const tabManager = useTabManager()
const dataSources = useDataSources()

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
  <div class="flex-1 flex flex-col overflow-auto">
    <DatabaseExplorerItem
      v-for="dataSource in dataSources"
      :key="dataSource"
      :data-source-key="dataSource"
      @select="() => handleSelect(dataSource)"
      @delete="() => handleDelete(dataSource)"
    />
  </div>
</template>

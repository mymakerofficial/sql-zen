<script setup lang="ts">
import DatabaseExplorerItem from '@/components/databaseExplorer/DatabaseExplorerItem.vue'
import { useDataSources } from '@/composables/useDataSources'
import { useRegistry } from '@/composables/useRegistry'

const selected = defineModel<string | null>('selected', {
  required: true,
  default: null,
})

const registry = useRegistry()
const dataSources = useDataSources()

function handleDelete(key: string) {
  registry.unregister(key)
}

function handleSelect(key: string) {
  registry.start(key)
  selected.value = key
}
</script>

<template>
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
</template>

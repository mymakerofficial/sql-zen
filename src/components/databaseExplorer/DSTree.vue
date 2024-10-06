<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import EmbeddedDSTree from '@/components/databaseExplorer/EmbeddedDSTree.vue'
import { LoaderCircleIcon } from 'lucide-vue-next'
import { useRegistry } from '@/composables/useRegistry'

const props = defineProps<{
  dataSourceKey: string
}>()

const registry = useRegistry()
const dataSource = registry.getDataSource(props.dataSourceKey)

const { data, isFetching, error } = useQuery({
  queryKey: ['schemaTree', dataSource.key],
  queryFn: async () => {
    if (!dataSource) {
      throw new Error('Data source not found')
    }
    const sqlDialect = dataSource.getDialect()
    return await sqlDialect.getDataSourceTree()
  },
  refetchOnMount: false,
  initialData: [],
})
</script>

<template>
  <div>
    <p v-if="error" class="text-red-500 text-sm">
      {{ error }}
    </p>
    <div v-if="isFetching" class="h-12 ml-3.5 flex items-center">
      <LoaderCircleIcon
        class="size-4 min-h-max text-muted-foreground animate-spin"
      />
    </div>
    <EmbeddedDSTree v-else :items="data" />
  </div>
</template>

<script setup lang="ts">
import { DataSourceFacade } from '@/lib/databases/database'
import { useQuery } from '@tanstack/vue-query'
import { SqlDialectFactory } from '@/lib/dialect/factory'
import EmbeddedSchemaTree from '@/components/editor/EmbeddedSchemaTree.vue'
import { LoaderCircleIcon } from 'lucide-vue-next'

const props = defineProps<{
  dataSource: DataSourceFacade
}>()

const { data, isFetching } = useQuery({
  queryKey: ['schemaTree', props.dataSource.getKey()],
  queryFn: async () => {
    const sqlDialect = SqlDialectFactory.create(props.dataSource)
    return await sqlDialect.getSchemaTree()
  },
  initialData: [],
})
</script>

<template>
  <div>
    <div v-if="isFetching" class="h-12 ml-3.5 flex items-center">
      <LoaderCircleIcon
        class="size-4 min-w-max text-muted-foreground animate-spin"
      />
    </div>
    <EmbeddedSchemaTree v-else :items="data" />
  </div>
</template>

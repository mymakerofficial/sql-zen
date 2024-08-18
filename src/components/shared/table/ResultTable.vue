<script setup lang="ts">
import DataTable from '@/components/shared/table/DataTable.vue'
import { createColumnHelper } from '@tanstack/vue-table'
import { computed, h } from 'vue'
import type { QueryResult } from '@/lib/queries/interface'
import ResultTableHeader from '@/components/shared/table/ResultTableHeader.vue'

const props = defineProps<{
  data: QueryResult
}>()

const columnHelper = createColumnHelper<object>()
const columns = computed(() => {
  return props.data.columns.map((column) =>
    // @ts-expect-error
    columnHelper.accessor(column.name, {
      header: () => h(ResultTableHeader, { column }),
    }),
  )
})
</script>

<template>
  <DataTable :data="data.rows" :columns="columns" />
</template>

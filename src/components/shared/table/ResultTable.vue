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
  return props.data.fields.map((field) =>
    // @ts-expect-error
    columnHelper.accessor(field.name, {
      header: () => h(ResultTableHeader, { field }),
    }),
  )
})
</script>

<template>
  <DataTable :data="data.rows" :columns="columns" />
</template>

<script setup lang="ts">
import DataTable from '@/components/shared/table/DataTable.vue'
import { createColumnHelper } from '@tanstack/vue-table'
import { computed, h } from 'vue'
import type { PaginatedQueryResult, QueryResult } from '@/lib/queries/interface'
import ResultTableHeader from '@/components/shared/table/ResultTableHeader.vue'
import ResultTableCell from '@/components/shared/table/ResultTableCell.vue'
import ResultTableIndexCell from '@/components/shared/table/ResultTableIndexCell.vue'

const props = defineProps<{
  data: QueryResult & Partial<PaginatedQueryResult>
}>()

const columnHelper = createColumnHelper<object>()
const columns = computed(() => {
  const resultColumns = props.data.fields.map((field) =>
    // @ts-expect-error
    columnHelper.accessor(field.name, {
      header: () => h(ResultTableHeader, { field }),
      cell: (ctx) => h(ResultTableCell, { field, value: ctx.getValue() }),
    }),
  )

  return [
    columnHelper.display({
      id: '__row-number__',
      header: () => h('span', { class: 'sr-only' }, 'Row number'),
      cell: (ctx) => h(ResultTableIndexCell, {
        index: ctx.row.index,
        offset: props.data.offset ?? 0
      }),
      meta: {
        className:
          'border-r border-border text-center sticky left-0 h-full bg-background',
      }
    }),
    ...resultColumns,
  ]
})
</script>

<template>
  <DataTable :data="data.rows" :columns="columns" />
</template>

<script setup lang="ts">
import DataTable from '@/components/shared/table/DataTable.vue'
import { createColumnHelper } from '@tanstack/vue-table'
import { computed } from 'vue'
import type { QueryResult } from '@/lib/queries/interface'

const props = defineProps<{
  data: QueryResult
}>()

const columnHelper = createColumnHelper<object>()
const columns = computed(() => {
  return props.data.rows.length
    ? Object.keys(props.data.rows[0]).map((key) =>
        // @ts-ignore // TODO: Fix this
        columnHelper.accessor(key, {
          header: key,
        }),
      )
    : []
})
</script>

<template>
  <DataTable :data="data.rows" :columns="columns" />
</template>

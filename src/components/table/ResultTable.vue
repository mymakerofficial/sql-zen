<script setup lang="ts">
import DataTable from '@/components/table/DataTable.vue'
import { createColumnHelper } from '@tanstack/vue-table'
import { computed } from 'vue'
import type { QueryResult } from '@/lib/databases/database'

const props = defineProps<{
  data: QueryResult
}>()

const columnHelper = createColumnHelper<object>()
const columns = computed(() => {
  return props.data.length
    ? Object.keys(props.data[0]).map((key) =>
        // @ts-ignore // TODO: Fix this
        columnHelper.accessor(key, {
          header: key,
        }),
      )
    : []
})
</script>

<template>
  <DataTable :data="data" :columns="columns" />
</template>

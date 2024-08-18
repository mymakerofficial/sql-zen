<script setup lang="ts" generic="TData">
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  FlexRender,
  getCoreRowModel,
  type TableOptions,
  useVueTable,
} from '@tanstack/vue-table'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'

const props = defineProps<{
  class?: string
  data: TableOptions<TData>['data']
  columns: TableOptions<TData>['columns']
  options?: Partial<TableOptions<TData>>
}>()

const table = useVueTable({
  get data() {
    return props.data
  },
  get columns() {
    return props.columns
  },
  getCoreRowModel: getCoreRowModel(),
  ...props.options,
})
</script>

<template>
  <div class="flex-1 relative overflow-hidden">
    <Separator class="absolute top-12 z-1" />
    <Table
      container-class="h-[calc(100%-3rem)] relative"
      :class="cn('', props.class)"
    >
      <TableHeader class="sticky top-0 bg-background [&_tr]:border-b-0">
        <TableRow
          v-for="headerGroup in table.getHeaderGroups()"
          :key="headerGroup.id"
        >
          <TableHead
            v-for="header in headerGroup.headers"
            :key="header.id"
            :class="(header.column.columnDef.meta as any)?.className"
          >
            <FlexRender
              v-if="!header.isPlaceholder"
              :render="header.column.columnDef.header"
              :props="header.getContext()"
            />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <template v-if="table.getRowModel().rows?.length">
          <TableRow
            v-for="row in table.getRowModel().rows"
            :key="row.id"
            :data-state="row.getIsSelected() && 'selected'"
          >
            <TableCell
              v-for="cell in row.getVisibleCells()"
              :key="cell.id"
              :class="(cell.column.columnDef.meta as any)?.className"
            >
              <FlexRender
                :render="cell.column.columnDef.cell"
                :props="cell.getContext()"
              />
            </TableCell>
          </TableRow>
        </template>
        <template v-else>
          <TableRow>
            <TableCell :colspan="columns.length" class="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        </template>
      </TableBody>
    </Table>
  </div>
</template>

<script setup lang="ts">
import { useRegistry } from '@/composables/useRegistry'
import type { DuckDB } from '@/lib/dataSources/impl/duckdb'
import BaseDialog from '@/components/shared/dialog/BaseDialog.vue'
import { useDialogContext } from '@/composables/useDialog'
import { useMutation, useQuery } from '@tanstack/vue-query'
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import FileInput from '@/components/shared/FileInput.vue'
import type { FileAccessor } from '@/lib/files/fileAccessor'
import DataTable from '@/components/shared/table/DataTable.vue'
import type { WebFile } from '@duckdb/duckdb-wasm'
import { createColumnHelper } from '@tanstack/vue-table'
import { UploadIcon } from 'lucide-vue-next'
import DuckDbExplorerItemActions from '@/components/shared/dialogs/duckDbExplorer/DuckDbExplorerItemActions.vue'
import { computed, h, ref } from 'vue'
import { downloadFile } from '@/lib/downloadFile'

const props = defineProps<{
  dataSourceKey: string
}>()

const { open, close } = useDialogContext()

const registry = useRegistry()
const dataSource = registry.getDataSource(props.dataSourceKey) as DuckDB

const {
  data,
  refetch,
  error: fetchError,
} = useQuery({
  queryKey: ['getRegisteredFiles', props.dataSourceKey],
  queryFn: () => dataSource.getRegisteredFiles(),
  initialData: [],
})

const { mutate: handleRegisterFile, error: registerError } = useMutation({
  mutationFn: (file: FileAccessor) => dataSource.registerFile(file),
  onSuccess: () => refetch(),
})

const { mutate: handleDeleteFile, error: deleteError } = useMutation({
  mutationFn: (item: WebFile) => dataSource.dropFile(item.fileName),
  onSuccess: () => refetch(),
})

const { mutate: handleDownloadFile, error: downloadError } = useMutation({
  mutationFn: async (item: WebFile) => {
    const file = await dataSource.exportFile(item.fileName)
    downloadFile(file)
  },
})

const { mutate: handleOpenDatabase, error: openDatabaseError } = useMutation({
  mutationFn: (item: WebFile) => dataSource.openDatabase(item.fileName),
  onSuccess: close,
})

const errors = computed(() =>
  [
    fetchError.value,
    registerError.value,
    deleteError.value,
    downloadError.value,
    openDatabaseError.value,
  ].filter((e) => e),
)

const columnHelper = createColumnHelper<WebFile>()
const columns = [
  columnHelper.accessor('fileName', {
    header: 'Name',
  }),
  columnHelper.accessor('fileSize', {
    header: 'Size',
    cell: (ctx) => {
      return ctx.getValue() ? `${ctx.getValue()} bytes` : 'unknown'
    },
  }),
  columnHelper.display({
    id: 'actions',
    cell: (ctx) =>
      h(DuckDbExplorerItemActions, {
        item: ctx.row.original,
        onDeleteFile: handleDeleteFile,
        onDownloadFile: handleDownloadFile,
        onOpenDatabase: handleOpenDatabase,
      }),
    meta: {
      className: 'w-0',
    },
  }),
]
</script>

<template>
  <BaseDialog v-model:open="open">
    <DialogHeader>
      <DialogHeader>DuckDB Local File System</DialogHeader>
      <DialogDescription>
        <p>
          DuckDB local file system is a virtual file system that allows you to
          register files to be used in your queries.
        </p>
        <p>
          DuckDB can load table data from CSV, JSON, and Parquet files. You can
          also upload and open databases from here.
        </p>
      </DialogDescription>
    </DialogHeader>
    <div class="max-h-72 overflow-auto">
      <DataTable :data="data" :columns="columns" />
    </div>
    <p v-for="error in errors" class="text-red-500">{{ error }}</p>
    <DialogFooter>
      <FileInput @selected="handleRegisterFile">
        <Button class="gap-3">
          <UploadIcon class="size-4 min-w-max" />
          <span>Upload</span>
        </Button>
      </FileInput>
    </DialogFooter>
  </BaseDialog>
</template>

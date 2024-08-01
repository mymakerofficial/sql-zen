<script setup lang="ts">
import { useRegistry } from '@/composables/useRegistry'
import type { DuckDB } from '@/lib/dataSources/impl/duckdb'
import { useDialog, useDialogContext } from '@/composables/useDialog'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { Button } from '@/components/ui/button'
import FileInput from '@/components/shared/FileInput.vue'
import type { FileAccessor } from '@/lib/files/fileAccessor'
import DataTable from '@/components/shared/table/DataTable.vue'
import type { WebFile } from '@duckdb/duckdb-wasm'
import { createColumnHelper } from '@tanstack/vue-table'
import { UploadIcon } from 'lucide-vue-next'
import DuckDbExplorerItemActions from '@/components/shared/dialogs/duckDbExplorer/DuckDbExplorerItemActions.vue'
import { computed, h } from 'vue'
import { downloadFile } from '@/lib/downloadFile'
import FileViewerDialog from '@/components/shared/dialogs/fileViewer/FileViewerDialog.vue'
import ResponsiveDialog from '@/components/shared/responsiveDialog/ResponsiveDialog.vue'
import ResponsiveDialogContent from '@/components/shared/responsiveDialog/ResponsiveDialogContent.vue'
import ResponsiveDialogHeader from '@/components/shared/responsiveDialog/ResponsiveDialogHeader.vue'
import ResponsiveDialogTitle from '@/components/shared/responsiveDialog/ResponsiveDialogTitle.vue'
import ResponsiveDialogDescription from '@/components/shared/responsiveDialog/ResponsiveDialogDescription.vue'
import ResponsiveDialogFooter from '@/components/shared/responsiveDialog/ResponsiveDialogFooter.vue'

const props = defineProps<{
  dataSourceKey: string
}>()

const { open, close } = useDialogContext()
const { open: openFileViewer } = useDialog(FileViewerDialog)

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

async function handleOpenFileViewer(item: WebFile) {
  openFileViewer({ fileAccessor: await dataSource.exportFile(item.fileName) })
}

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
    cell: (ctx) =>
      h(
        Button,
        {
          onClick: () => handleOpenFileViewer(ctx.row.original),
          variant: 'ghost',
        },
        ctx.getValue(),
      ),
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
        onOpenFile: handleOpenFileViewer,
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
  <ResponsiveDialog v-model:open="open">
    <ResponsiveDialogContent>
      <ResponsiveDialogHeader>
        <ResponsiveDialogTitle>DuckDB Local File System</ResponsiveDialogTitle>
        <ResponsiveDialogDescription>
          <p>
            DuckDB local file system is a virtual file system that allows you to
            register files to be used in your queries.
          </p>
          <p>
            DuckDB can load table data from CSV, JSON, and Parquet files. You
            can also upload and open databases from here.
          </p>
        </ResponsiveDialogDescription>
      </ResponsiveDialogHeader>
      <div class="max-h-72 overflow-auto">
        <DataTable :data="data" :columns="columns" />
      </div>
      <p v-for="error in errors" class="text-red-500">{{ error }}</p>
      <ResponsiveDialogFooter>
        <FileInput @selected="handleRegisterFile">
          <Button class="gap-3">
            <UploadIcon class="size-4 min-w-max" />
            <span>Upload</span>
          </Button>
        </FileInput>
      </ResponsiveDialogFooter>
    </ResponsiveDialogContent>
  </ResponsiveDialog>
</template>

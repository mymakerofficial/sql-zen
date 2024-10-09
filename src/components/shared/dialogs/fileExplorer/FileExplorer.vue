<script setup lang="ts">
import { useRegistry } from '@/composables/useRegistry'
import { useDialog, useDialogContext } from '@/composables/useDialog'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { Button } from '@/components/ui/button'
import FileInput from '@/components/shared/FileInput.vue'
import type { FileAccessor } from '@/lib/files/fileAccessor'
import DataTable from '@/components/shared/table/DataTable.vue'
import { createColumnHelper } from '@tanstack/vue-table'
import { UploadIcon } from 'lucide-vue-next'
import DuckDbExplorerItemActions from '@/components/shared/dialogs/fileExplorer/FileExplorerItemActions.vue'
import { computed, h } from 'vue'
import { downloadFile } from '@/lib/downloadFile'
import FileViewerDialog from '@/components/shared/dialogs/fileViewer/FileViewerDialog.vue'
import ResponsiveDialog from '@/components/shared/responsiveDialog/ResponsiveDialog.vue'
import ResponsiveDialogContent from '@/components/shared/responsiveDialog/ResponsiveDialogContent.vue'
import ResponsiveDialogHeader from '@/components/shared/responsiveDialog/ResponsiveDialogHeader.vue'
import ResponsiveDialogTitle from '@/components/shared/responsiveDialog/ResponsiveDialogTitle.vue'
import ResponsiveDialogDescription from '@/components/shared/responsiveDialog/ResponsiveDialogDescription.vue'
import ResponsiveDialogFooter from '@/components/shared/responsiveDialog/ResponsiveDialogFooter.vue'
import type { FileInfo } from '@/lib/files/interface'
import { useSeline } from '@/composables/seline/seline'
import { DatabaseEngine } from '@/lib/engines/enums'
import { useTabManager } from '@/composables/tabs/useTabManager'
import { TabType } from '@/lib/tabs/enums'
import { StatementExtractor } from '@/lib/statements/extractStatements'

const props = defineProps<{
  dataSourceKey: string
}>()

const { track } = useSeline()

const { open, close } = useDialogContext()
const { open: openFileViewer } = useDialog(FileViewerDialog)

const tabManager = useTabManager()

const registry = useRegistry()
const dataSource = registry.getDataSource(props.dataSourceKey)

// TODO: use engine capabilities config for this
const canCreateAsTable = dataSource.engine === DatabaseEngine.DuckDB

const {
  data,
  refetch,
  error: fetchError,
} = useQuery({
  queryKey: ['getFiles', props.dataSourceKey],
  queryFn: () => dataSource.getFiles(),
  initialData: [],
  throwOnError: true,
})

const { mutate: handleRegisterFile, error: registerError } = useMutation({
  mutationFn: async (file: FileAccessor) => {
    track('file-explorer: register-file', {
      ...dataSource.getAnonymizedAnalyticsData(),
      fileSizeRounded: Math.round(((await file.getSize()) ?? 0) / 1024) + 'KB',
    })
    await dataSource.writeFile(file.getName(), file)
  },
  onSuccess: () => refetch(),
})

const { mutate: handleDeleteFile, error: deleteError } = useMutation({
  mutationFn: async (item: FileInfo) => {
    track('file-explorer: delete-file', {
      ...dataSource.getAnonymizedAnalyticsData(),
    })
    await dataSource.deleteFile(item.path)
  },
  onSuccess: () => refetch(),
})

const { mutateAsync: readFile, error: readError } = useMutation({
  mutationFn: async (item: FileInfo) => {
    track('file-explorer: read-file', {
      ...dataSource.getAnonymizedAnalyticsData(),
      fileSizeRounded: Math.round(item.size / 1024) + 'KB',
    })
    return await dataSource.readFile(item.path)
  },
})

async function handleDownloadFile(item: FileInfo) {
  const fileAccessor = await readFile(item)
  downloadFile(fileAccessor)
}

async function handleOpenFileViewer(item: FileInfo) {
  const fileAccessor = await readFile(item)
  openFileViewer({ fileAccessor })
}

// TODO: extract to a helper
function handleCreateAsTable(item: FileInfo) {
  const fileName = item.path
  const tableName = fileName
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-zA-Z0-9]/g, '_')
    .replace(/_+/g, '_')
    .toLowerCase()

  const sql = `-- Create the table from the file
CREATE TABLE ${tableName} AS
FROM '${fileName}';

-- Summary of the table
SUMMARIZE ${tableName};

-- Display everything in the table
SELECT * FROM ${tableName};`

  close()

  tabManager.createTab({
    type: TabType.Console,
    dataSourceKey: props.dataSourceKey,
    displayName: `Table from ${fileName}`,
    modelValue: sql,
  })

  dataSource.runner.batch(StatementExtractor.fromValue(sql).extract(), true)
}

const errors = computed(() =>
  [
    fetchError.value,
    registerError.value,
    deleteError.value,
    readError.value,
  ].filter((e) => e),
)

const columnHelper = createColumnHelper<FileInfo>()
const columns = [
  columnHelper.accessor('path', {
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
  columnHelper.accessor('size', {
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
        canCreateAsTable,
        onOpenFile: handleOpenFileViewer,
        onDeleteFile: handleDeleteFile,
        onDownloadFile: handleDownloadFile,
        onCreateAsTable: handleCreateAsTable,
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
        <ResponsiveDialogTitle>Local File System</ResponsiveDialogTitle>
        <ResponsiveDialogDescription>
          <p>
            You can upload files to the In-Browser File System to be used in
            your queries. Files stored here will be lost when reloading the
            page.
          </p>
        </ResponsiveDialogDescription>
      </ResponsiveDialogHeader>
      <div class="max-h-72 overflow-auto">
        <DataTable :data="data" :columns="columns" />
      </div>
      <p v-for="(error, index) in errors" class="text-red-500" :key="index">
        {{ error }}
      </p>
      <ResponsiveDialogFooter>
        <FileInput @selected="handleRegisterFile">
          <Button class="gap-3">
            <UploadIcon class="size-4" />
            <span>Upload</span>
          </Button>
        </FileInput>
      </ResponsiveDialogFooter>
    </ResponsiveDialogContent>
  </ResponsiveDialog>
</template>

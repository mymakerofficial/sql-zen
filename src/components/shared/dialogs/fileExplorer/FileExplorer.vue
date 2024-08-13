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

const props = defineProps<{
  dataSourceKey: string
}>()

const { open } = useDialogContext()
const { open: openFileViewer } = useDialog(FileViewerDialog)

const registry = useRegistry()
const dataSource = registry.getDataSource(props.dataSourceKey)

const {
  data,
  refetch,
  error: fetchError,
} = useQuery({
  queryKey: ['getFiles', props.dataSourceKey],
  queryFn: () => dataSource.getFiles(),
  initialData: [],
})

const { mutate: handleRegisterFile, error: registerError } = useMutation({
  mutationFn: (file: FileAccessor) =>
    dataSource.writeFile(file.getName(), file),
  onSuccess: () => refetch(),
})

const { mutate: handleDeleteFile, error: deleteError } = useMutation({
  mutationFn: (item: FileInfo) => dataSource.deleteFile(item.path),
  onSuccess: () => refetch(),
})

const { mutateAsync: readFile, error: readError } = useMutation({
  mutationFn: async (item: FileInfo) => {
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
        onOpenFile: handleOpenFileViewer,
        onDeleteFile: handleDeleteFile,
        onDownloadFile: handleDownloadFile,
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
            <UploadIcon class="size-4 min-h-max" />
            <span>Upload</span>
          </Button>
        </FileInput>
      </ResponsiveDialogFooter>
    </ResponsiveDialogContent>
  </ResponsiveDialog>
</template>

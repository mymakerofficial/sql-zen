<script setup lang="ts">
import { FileAccessor } from '@/lib/files/fileAccessor'
import { useDialogContext } from '@/composables/useDialog'
import { computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import MonacoEditor from '@/components/shared/monaco/MonacoEditor.vue'
import { DownloadIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import FileViewer from '@/components/shared/fileViewer/FileViewer.vue'
import { downloadFile } from '@/lib/downloadFile'

const props = defineProps<{
  fileAccessor: FileAccessor
}>()

const { open } = useDialogContext()

const fileName = computed(() => {
  return props.fileAccessor.getName()
})

const { data: fileSize } = useQuery({
  queryKey: ['fileSize', fileName],
  queryFn: async () => props.fileAccessor.getSize(),
  initialData: 0,
})

function handleDownload() {
  downloadFile(props.fileAccessor)
}
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent
      class="max-w-full w-full h-full lg:w-3/4 lg:h-3/4 flex flex-col"
    >
      <DialogHeader>
        <DialogTitle>{{ fileAccessor.getName() }}</DialogTitle>
        <DialogDescription>{{ fileSize }} bytes</DialogDescription>
      </DialogHeader>
      <FileViewer :file-accessor="fileAccessor" class="flex-1" />
      <DialogFooter>
        <Button @click="handleDownload" class="gap-3">
          <DownloadIcon class="size-4 min-h-max" />
          <span>Download</span>
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

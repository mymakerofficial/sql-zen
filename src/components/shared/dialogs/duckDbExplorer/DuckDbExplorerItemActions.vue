<script setup lang="ts">
import type { WebFile } from '@duckdb/duckdb-wasm'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import {
  DownloadIcon,
  MenuIcon,
  Trash2Icon,
  DatabaseIcon,
  ClipboardIcon,
  EyeIcon,
} from 'lucide-vue-next'
import { copyToClipboard } from '@/lib/copyToClipboard'

const props = defineProps<{
  item: WebFile
}>()

const emit = defineEmits<{
  openFile: [file: WebFile]
  deleteFile: [file: WebFile]
  downloadFile: [file: WebFile]
  openDatabase: [file: WebFile]
}>()

function handleOpenFile() {
  emit('openFile', props.item)
}

function handleDeleteFile() {
  emit('deleteFile', props.item)
}

function handleDownloadFile() {
  emit('downloadFile', props.item)
}

function handleOpenDatabae() {
  emit('openDatabase', props.item)
}

function handleCopyName() {
  copyToClipboard(props.item.fileName)
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger>
      <Button variant="ghost"><MenuIcon class="size-4 min-w-max" /></Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem @click="handleOpenFile" class="gap-2">
        <EyeIcon class="size-4 min-w-max" />
        <span>Open</span>
      </DropdownMenuItem>
      <DropdownMenuItem @click="handleDownloadFile" class="gap-2">
        <DownloadIcon class="size-4 min-w-max" />
        <span>Download</span>
      </DropdownMenuItem>
      <DropdownMenuItem @click="handleDeleteFile" class="gap-2">
        <Trash2Icon class="size-4 min-w-max" />
        <span>Delete</span>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="handleOpenDatabae" class="gap-2">
        <DatabaseIcon class="size-4 min-w-max" />
        <span>Open As Database</span>
      </DropdownMenuItem>
      <DropdownMenuItem @click="handleCopyName" class="gap-2">
        <ClipboardIcon class="size-4 min-w-max" />
        <span>Copy Name</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

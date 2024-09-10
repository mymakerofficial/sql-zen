<script setup lang="ts">
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ClipboardIcon, DownloadIcon, EyeIcon, MenuIcon, Trash2Icon, TableIcon } from 'lucide-vue-next'
import { copyToClipboard } from '@/lib/copyToClipboard'
import type { FileInfo } from '@/lib/files/interface'

const props = defineProps<{
  item: FileInfo,
  canCreateAsTable: boolean,
}>()

const emit = defineEmits<{
  openFile: [file: FileInfo]
  deleteFile: [file: FileInfo]
  downloadFile: [file: FileInfo]
  createAsTable: [file: FileInfo]
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

function handleCopyName() {
  copyToClipboard(props.item.path)
}

function handleCreateAsTable() {
  emit('createAsTable', props.item)
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger>
      <Button variant="ghost"><MenuIcon class="size-4 min-h-max" /></Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem @click="handleOpenFile" class="gap-2">
        <EyeIcon class="size-4 min-h-max" />
        <span>Open</span>
      </DropdownMenuItem>
      <DropdownMenuItem @click="handleDownloadFile" class="gap-2">
        <DownloadIcon class="size-4 min-h-max" />
        <span>Download</span>
      </DropdownMenuItem>
      <DropdownMenuItem @click="handleDeleteFile" class="gap-2">
        <Trash2Icon class="size-4 min-h-max" />
        <span>Delete</span>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="handleCopyName" class="gap-2">
        <ClipboardIcon class="size-4 min-h-max" />
        <span>Copy Name</span>
      </DropdownMenuItem>
      <DropdownMenuItem @click="handleCreateAsTable" class="gap-2">
        <TableIcon class="size-4 min-h-max" />
        <span>Create Table from File</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

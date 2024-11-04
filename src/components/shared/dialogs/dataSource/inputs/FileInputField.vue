<script setup lang="ts">
import FileInput from '@/components/shared/FileInput.vue'
import { useField } from 'vee-validate'
import { Button } from '@/components/ui/button'
import type { FileAccessor } from '@/lib/files/fileAccessor'
import { FileIcon } from 'lucide-vue-next'

const props = defineProps<{
  name: string
}>()

const { value, setValue } = useField<FileAccessor>(props.name)
</script>

<template>
  <FileInput @selected="setValue" :id="name">
    <Button variant="outline" class="w-full gap-3">
      <FileIcon class="size-4" />
      <span>{{ value.getOrUndefined()?.getName() ?? 'Select File' }}</span>
    </Button>
  </FileInput>
</template>

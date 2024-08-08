<script setup lang="ts">
import { FileAccessor } from '@/lib/files/fileAccessor'
import { useQuery } from '@tanstack/vue-query'
import MonacoEditor from '@/components/shared/monaco/MonacoEditor.vue'
import { useEditor } from '@/composables/editor/useEditor'
import { computed, type HTMLAttributes, watch } from 'vue'
import { getLanguage } from '@/lib/langs/getLanguage'
import { createEmptyModel } from '@/lib/monaco/createEmptyModel'
import { cn } from '@/lib/utils'

const props = defineProps<{
  fileAccessor: FileAccessor
  class: HTMLAttributes['class']
}>()

const fileName = computed(() => {
  return props.fileAccessor.getName()
})

const {
  data: fileContent,
  error,
  isPending,
} = useQuery({
  queryKey: ['fileContent', fileName],
  queryFn: async () => props.fileAccessor.readText(),
})

const editor = useEditor({
  model: createEmptyModel(getLanguage(fileName.value)),
  readonly: true,
  glyphMargin: false,
})

watch(
  fileContent,
  (content) => {
    editor.editor.getModel()?.setValue(content ?? '')
  },
  { immediate: true },
)
</script>

<template>
  <section :class="cn('flex flex-col', props.class)">
    <div v-if="isPending">Loading...</div>
    <div v-else-if="error" class="flex-1 flex justify-center items-center">
      <p class="text-red-500">Error: {{ error.message || 'Unknown error' }}</p>
    </div>
    <div v-else class="flex-1">
      <MonacoEditor :editor="editor" />
    </div>
  </section>
</template>

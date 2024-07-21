<script setup lang="ts">
import * as monaco from 'monaco-editor'
import { shikiToMonaco } from '@shikijs/monaco'
import { onMounted, onScopeDispose, ref, watch } from 'vue'
import { useActualColorMode } from '@/composables/useActualColorMode'
import { getThemeFromMode, highlighter } from '@/lib/highlighter'

const props = defineProps<{
  model: monaco.editor.ITextModel
}>()

const container = ref<HTMLElement | null>(null)
let editor: monaco.editor.IStandaloneCodeEditor | null = null

const mode = useActualColorMode()

onMounted(async () => {
  shikiToMonaco(highlighter, monaco)

  editor = monaco.editor.create(container.value!, {
    model: props.model,
    automaticLayout: true,
    minimap: {
      enabled: false,
    },
    theme: getThemeFromMode(mode.value),
  })
})

watch(mode, () => {
  if (!editor) {
    return
  }

  editor.updateOptions({
    theme: getThemeFromMode(mode.value),
  })
})

onScopeDispose(() => {
  editor?.dispose()
  // highlighter?.dispose() // TODO: Fix this
})
</script>

<template>
  <div ref="container" class="w-full h-full"></div>
</template>

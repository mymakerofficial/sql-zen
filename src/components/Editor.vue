<script setup lang="ts">
import * as monaco from 'monaco-editor'
import { createHighlighter, type HighlighterGeneric } from 'shiki'
import { shikiToMonaco } from '@shikijs/monaco'
import { onMounted, onScopeDispose, ref, watch } from 'vue'
import { useActualColorMode } from '@/composables/useActualColorMode'

const props = defineProps<{
  model: monaco.editor.ITextModel
}>()

const container = ref<HTMLElement | null>(null)
let editor: monaco.editor.IStandaloneCodeEditor | null = null
let highlighter: HighlighterGeneric<any, any> | null = null

const mode = useActualColorMode()

function getTheme() {
  return mode.value === 'light' ? 'vitesse-light' : 'vitesse-dark'
}

onMounted(async () => {
  highlighter = await createHighlighter({
    themes: ['vitesse-dark', 'vitesse-light'],
    langs: ['sql'],
  })

  shikiToMonaco(highlighter, monaco)

  editor = monaco.editor.create(container.value!, {
    model: props.model,
    theme: getTheme(),
  })
})

watch(mode, () => {
  if (!editor) {
    return
  }

  editor.updateOptions({
    theme: getTheme(),
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

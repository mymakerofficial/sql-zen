<script setup lang="ts">
import * as monaco from 'monaco-editor'
import { createHighlighter, type HighlighterGeneric } from 'shiki'
import { shikiToMonaco } from '@shikijs/monaco'
import { onMounted, onScopeDispose, ref } from 'vue'

const props = defineProps<{
  model: monaco.editor.ITextModel
}>()

const container = ref<HTMLElement | null>(null)
let editor: monaco.editor.IStandaloneCodeEditor | null = null
let highlighter: HighlighterGeneric<any, any> | null = null

onMounted(async () => {
  highlighter = await createHighlighter({
    themes: ['vitesse-dark', 'vitesse-light'],
    langs: ['sql'],
  })

  shikiToMonaco(highlighter, monaco)

  editor = monaco.editor.create(container.value!, {
    model: props.model,
    theme: 'vitesse-dark',
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

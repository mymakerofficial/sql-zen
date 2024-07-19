<script setup lang="ts">
import * as monaco from 'monaco-editor'
import { createHighlighter, type HighlighterGeneric } from 'shiki'
import { shikiToMonaco } from '@shikijs/monaco'
import { onMounted, onScopeDispose, onUnmounted, ref } from 'vue'

const model = defineModel<string>({ default: '' })

const container = ref<HTMLElement | null>(null)
let editor: monaco.editor.IStandaloneCodeEditor | null = null
let highlighter: HighlighterGeneric<any, any> | null = null

onMounted(async () => {
  highlighter = await createHighlighter({
    themes: [
      'vitesse-dark',
      'vitesse-light',
    ],
    langs: [
      'sql'
    ],
  })

  shikiToMonaco(highlighter, monaco)

  editor = monaco.editor.create(container.value!, {
    value: model.value,
    language: 'sql',
    theme: 'vitesse-dark',
  })

  editor.onDidChangeModelContent(() => {
    model.value = editor?.getValue() ?? ''
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
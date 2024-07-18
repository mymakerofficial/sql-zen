<script setup lang="ts">
import * as monaco from 'monaco-editor'
import { createHighlighter, type HighlighterGeneric } from 'shiki'
import { shikiToMonaco } from '@shikijs/monaco'
import { onMounted, onScopeDispose, ref } from 'vue'

const container = ref<HTMLElement | null>(null)
const editor = ref<monaco.editor.IStandaloneCodeEditor | null>(null)
const highlighter = ref<HighlighterGeneric<any, any> | null>(null)

onMounted(async () => {
  highlighter.value = await createHighlighter({
    themes: [
      'vitesse-dark',
      'vitesse-light',
    ],
    langs: [
      'sql'
    ],
  })

  monaco.languages.register({ id: 'sql' })

  shikiToMonaco(highlighter.value, monaco)

  editor.value = monaco.editor.create(container.value!, {
    value: 'select * from users;',
    language: 'sql',
    theme: 'vitesse-dark',
  })
})

onScopeDispose(() => {
  editor.value?.dispose()
  highlighter.value?.dispose()
})
</script>

<template>
  <div ref="container" style="height: 100vh;"></div>
</template>
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
      'dracula'
    ],
    langs: [
      'sql'
    ],
  })

  monaco.languages.register({ id: 'sql' })

  shikiToMonaco(highlighter.value, monaco)

  editor.value = monaco.editor.create(container.value!, {
    value:
`SELECT station_name, count(*) AS num_services
FROM train_services
ORDER BY num_services DESC
LIMIT 3;`,
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
  <div ref="container" class="w-full h-full"></div>
</template>
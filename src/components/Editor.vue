<script setup lang="ts">
import * as monaco from 'monaco-editor'
import { onMounted, onScopeDispose, ref } from 'vue'

const container = ref<HTMLElement | null>(null)
const editor = ref<monaco.editor.IStandaloneCodeEditor | null>(null)

onMounted(() => {
  editor.value = monaco.editor.create(container.value!, {
    value: 'select * from users;',
    language: 'sql',
  })
})

onScopeDispose(() => {
  editor.value?.dispose()
})
</script>

<template>
  <div ref="container" style="height: 100vh;"></div>
</template>
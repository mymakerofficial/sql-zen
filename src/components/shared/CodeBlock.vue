<script setup lang="ts">
import { useHighlight } from '@/composables/useHighlighter'

const props = defineProps<{
  code: string
}>()

const html = useHighlight(() => props.code)
</script>

<template>
  <div v-html="html" />
</template>

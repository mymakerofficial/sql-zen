<script setup lang="ts">
import type { UseEditor } from '@/composables/editor/useEditor'
import { onMounted, ref } from 'vue'

const props = defineProps<{
  editor: UseEditor
}>()

const container = ref<HTMLElement | null>(null)

onMounted(() => {
  props.editor.mount(container.value)
})
</script>

<template>
  <div ref="container" class="w-full h-full"></div>
</template>

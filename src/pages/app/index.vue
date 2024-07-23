<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue'
import Editor from '@/components/editor/Editor.vue'
</script>

<template>
  <AppLayout>
    <main class="flex-1 flex flex-col">
      <Editor />
    </main>
  </AppLayout>
</template>

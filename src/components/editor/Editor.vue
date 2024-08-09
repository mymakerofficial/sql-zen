<script setup lang="ts">
import DatabaseExplorer from '@/components/databaseExplorer/DatabaseExplorer.vue'
import EditorLayout from '@/layouts/EditorLayout.vue'
import TabView from '@/components/shared/tabs/TabView.vue'
</script>

<template>
  <EditorLayout>
    <template #aside>
      <DatabaseExplorer />
    </template>
    <template #main>
      <TabView />
    </template>
  </EditorLayout>
</template>

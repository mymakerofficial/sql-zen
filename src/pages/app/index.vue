<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue'
import { onMounted, onScopeDispose } from 'vue'
import Editor from '@/components/editor/Editor.vue'
import { DatabaseFactory } from '@/lib/databases/databaseFactory'
import { DatabaseEngine } from '@/lib/databaseEngines'
import { DatabaseEngineMode } from '@/lib/databases/database'

const database = DatabaseFactory.createDatabase({
  engine: DatabaseEngine.SQLite,
  mode: DatabaseEngineMode.Memory,
  identifier: null,
})

onMounted(() => database.init())
onScopeDispose(() => database.close())
</script>

<template>
  <AppLayout>
    <main class="flex-1 flex flex-col">
      <Editor :database="database" :init-value="'SELECT 1;'" />
    </main>
  </AppLayout>
</template>

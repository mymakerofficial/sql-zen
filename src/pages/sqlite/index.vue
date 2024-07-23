<script setup lang="ts">
import { onMounted, onScopeDispose } from 'vue'
import AppLayout from '@/layouts/AppLayout.vue'
import { useInit } from '@/composables/useInit'
import { SqliteFacade } from '@/lib/databases/sqlite'
import Editor from '@/components/editor/Editor.vue'
import example from './example.sql?raw'

const sqlite = new SqliteFacade()

const { init, isInitializing } = useInit(sqlite)

onMounted(init)
onScopeDispose(sqlite.close)
</script>

<template>
  <AppLayout>
    <main class="flex-1 flex flex-col">
      <Editor
        :database="sqlite"
        :init-value="example"
        :is-initializing="isInitializing"
      />
    </main>
  </AppLayout>
</template>

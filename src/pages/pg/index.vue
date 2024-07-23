<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue'
import { onMounted, onScopeDispose } from 'vue'
import { useInit } from '@/composables/useInit'
import { PostgreSQL } from '@/lib/databases/postgresql'
import Editor from '@/components/editor/Editor.vue'
import example from './example.sql?raw'

const pg = new PostgreSQL()

const { init, isInitializing } = useInit(pg)

onMounted(init)
onScopeDispose(pg.close)
</script>

<template>
  <AppLayout>
    <main class="flex-1 flex flex-col">
      <Editor
        :database="pg"
        :init-value="example"
        :is-initializing="isInitializing"
      />
    </main>
  </AppLayout>
</template>

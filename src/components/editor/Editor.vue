<script setup lang="ts">
import DatabaseExplorer from '@/components/databaseExplorer/DatabaseExplorer.vue'
import { watchEffect } from 'vue'
import { useDataSources } from '@/composables/useDataSources'
import EditorLayout from '@/layouts/EditorLayout.vue'
import { TabType } from '@/lib/tabs/enums'
import TabView from '@/components/shared/tabs/TabView.vue'
import { useTabManager } from '@/composables/useTabManager'

const tabManager = useTabManager()
const databases = useDataSources()

watchEffect(() => {
  databases.value.forEach((key) => {
    tabManager.createTab({
      type: TabType.Console,
      dataSourceKey: key,
    })
  })
})
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

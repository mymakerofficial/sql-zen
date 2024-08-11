<script setup lang="ts">
import DatabaseExplorer from '@/components/databaseExplorer/DatabaseExplorer.vue'
import EditorLayout from '@/layouts/EditorLayout.vue'
import TabView from '@/components/shared/tabs/TabView.vue'
import DatabaseExplorerDrawer from '@/components/databaseExplorer/DatabaseExplorerDrawer.vue'
import { useMediaQuery } from '@vueuse/core'
import { Separator } from '@/components/ui/separator'

const smallScreen = useMediaQuery('(max-width: 640px)')
</script>

<template>
  <EditorLayout>
    <template #aside>
      <DatabaseExplorer />
    </template>
    <template #main>
      <TabView>
        <template #beforeTabs>
          <DatabaseExplorerDrawer v-if="smallScreen" class="mx-2" />
          <Separator orientation="vertical" />
        </template>
      </TabView>
    </template>
  </EditorLayout>
</template>

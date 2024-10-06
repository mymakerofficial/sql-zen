<script setup lang="ts">
import DatabaseExplorer from '@/components/databaseExplorer/DatabaseExplorer.vue'
import EditorLayout from '@/layouts/EditorLayout.vue'
import TabView from '@/components/shared/tabs/TabView.vue'
import { Separator } from '@/components/ui/separator'
import { useEnv } from '@/composables/useEnv'
import EditorSidebar from '@/components/editor/EditorSidebar.vue'
import { MenuIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

const { isSmallScreen } = useEnv()
</script>

<template>
  <EditorLayout>
    <template #aside>
      <DatabaseExplorer />
    </template>
    <template #main>
      <TabView>
        <template #beforeTabs v-if="isSmallScreen">
          <EditorSidebar>
            <Button variant="ghost" class="h-full rounded-none">
              <MenuIcon class="size-4 min-h-max" />
            </Button>
          </EditorSidebar>
          <Separator orientation="vertical" />
        </template>
      </TabView>
    </template>
  </EditorLayout>
</template>

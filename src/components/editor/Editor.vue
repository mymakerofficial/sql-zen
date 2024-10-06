<script setup lang="ts">
import DatabaseExplorer from '@/components/databaseExplorer/DatabaseExplorer.vue'
import EditorLayout from '@/layouts/EditorLayout.vue'
import TabView from '@/components/shared/tabs/TabView.vue'
import { Separator } from '@/components/ui/separator'
import { useEnv } from '@/composables/useEnv'
import EditorSidebar from '@/components/editor/EditorSidebar.vue'
import { MenuIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import TitleBarControls from '@/components/shared/appHeader/TitleBarControls.vue'
import EditorHeader from '@/components/editor/EditorHeader.vue'

const { isMacOS, isWindows } = useEnv()
</script>

<template>
  <EditorLayout>
    <template #aside="{ compactHeader }">
      <EditorHeader v-if="compactHeader" />
      <DatabaseExplorer />
    </template>
    <template #main="{ compactHeader, noAside }">
      <TabView :data-tauri-drag-region="compactHeader">
        <template #beforeTabs v-if="noAside">
          <div
            v-if="compactHeader && isMacOS"
            data-tauri-drag-region
            class="w-24 border-r border-border"
          />
          <EditorSidebar>
            <Button variant="ghost" class="h-full rounded-none text-foreground">
              <MenuIcon class="size-4 min-h-max" />
            </Button>
          </EditorSidebar>
          <Separator orientation="vertical" />
        </template>
        <template #afterTabs v-if="compactHeader && isWindows">
          <TitleBarControls />
        </template>
      </TabView>
    </template>
  </EditorLayout>
</template>

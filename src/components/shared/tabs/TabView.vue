<script setup lang="ts">
import { useTabIds } from '@/composables/tabs/useTabIds'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useActiveTabId } from '@/composables/tabs/useActiveTabId'
import TabContentRenderer from '@/components/shared/tabs/TabContentRenderer.vue'
import TabTriggerContent from '@/components/shared/tabs/TabTriggerContent.vue'

defineProps<{
  dataTauriDragRegion?: boolean
}>()

const tabs = useTabIds()
const activeTab = useActiveTabId()
</script>

<template>
  <Tabs v-model="activeTab" class="h-full flex flex-col">
    <TabsList
      :data-tauri-drag-region="dataTauriDragRegion ? true : undefined"
      class="w-full min-h-12 border-b overflow-x-auto"
      :key="tabs.join()"
    >
      <div
        v-if="!!$slots.beforeTabs"
        class="h-full sticky left-0 bg-background flex z-10"
      >
        <slot name="beforeTabs" />
      </div>
      <TabsTrigger v-for="tabId in tabs" :value="tabId" :key="tabId" as-child>
        <TabTriggerContent :tab-id="tabId" />
      </TabsTrigger>
      <div
        v-if="!!$slots.afterTabs"
        class="ml-auto h-full sticky right-0 bg-background flex items-center z-10"
      >
        <slot name="afterTabs" />
      </div>
    </TabsList>
    <KeepAlive :max="6">
      <TabContentRenderer :tab-id="activeTab" :key="activeTab" />
    </KeepAlive>
  </Tabs>
</template>

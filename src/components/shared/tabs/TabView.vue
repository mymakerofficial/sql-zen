<script setup lang="ts">
import { useTabIds } from '@/composables/tabs/useTabIds'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useActiveTabId } from '@/composables/tabs/useActiveTabId'
import TabContentRenderer from '@/components/shared/tabs/TabContentRenderer.vue'
import TabTriggerContent from '@/components/shared/tabs/TabTriggerContent.vue'

const tabs = useTabIds()
const activeTab = useActiveTabId()
</script>

<template>
  <Tabs v-model="activeTab" class="h-full flex flex-col">
    <TabsList
      class="w-full min-h-12 border-b overflow-x-auto"
      :key="tabs.join()"
    >
      <div class="h-full sticky left-0 bg-background flex">
        <slot name="beforeTabs" />
      </div>
      <TabsTrigger v-for="tabId in tabs" :value="tabId" :key="tabId" as-child>
        <TabTriggerContent :tab-id="tabId" />
      </TabsTrigger>
    </TabsList>
    <TabContentRenderer :tab-id="activeTab" :key="activeTab" />
  </Tabs>
</template>

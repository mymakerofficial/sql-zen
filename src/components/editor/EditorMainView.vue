<script setup lang="ts">
import { useTabIds } from '@/composables/tabs/useTabIds'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useActiveTabId } from '@/composables/tabs/useActiveTabId'
import EditorTabTriggerContent from '@/components/editor/EditorTabTriggerContent.vue'

const tabs = useTabIds()
const activeTab = useActiveTabId()
</script>

<template>
  <Tabs v-model="activeTab" class="h-full flex flex-col">
    <TabsList class="w-full border-b overflow-x-auto">
      <TabsTrigger v-for="tabId in tabs" :value="tabId" :key="tabId" as-child>
        <EditorTabTriggerContent :tab-id="tabId" />
      </TabsTrigger>
    </TabsList>
    {{ activeTab }}
  </Tabs>
</template>

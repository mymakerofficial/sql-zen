<script setup lang="ts">
import { useTabDisplayName } from '@/composables/tabs/useTabDisplayName'
import { useIsActiveTab } from '@/composables/tabs/useActiveTabId'
import { useTabInfo } from '@/composables/tabs/useTabInfo'
import { computed } from 'vue'
import { useFlushableRef } from '@/composables/useFlushableRef'

const props = defineProps<{
  tabId: string
}>()

const isActive = useIsActiveTab(props.tabId)
const info = useTabInfo(props.tabId)
const [displayName, flushDisplayName] = useFlushableRef(
  useTabDisplayName(props.tabId),
)

const isEditable = computed(() => isActive.value && info.value.canRename)
</script>

<template>
  <span class="relative max-w-52 h-full flex items-center">
    <span class="truncate" :aria-hidden="isEditable">{{ displayName }}</span>
    <input
      v-if="isEditable"
      v-model="displayName"
      class="absolute w-full h-7 opacity-0 focus:opacity-100 focus:outline-none"
      @keydown.enter.prevent="flushDisplayName"
      @blur="flushDisplayName"
    />
  </span>
</template>

<script setup lang="ts">
import { useTabInfo } from '@/composables/tabs/useTabInfo'
import {
  FlowerIcon,
  SquareTerminalIcon,
  TableIcon,
  XIcon,
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { TabType } from '@/lib/tabs/enums'
import { useTabManager } from '@/composables/tabs/useTabManager'
import TabTriggerDisplayName from '@/components/shared/tabs/TabTriggerDisplayName.vue'

const props = defineProps<{
  tabId: string
}>()

const tabManager = useTabManager()
const info = useTabInfo(props.tabId)

function handleClose() {
  tabManager.removeTab(props.tabId)
}
</script>

<template>
  <button class="gap-2 group" @click.middle="handleClose">
    <img
      v-if="info.type === TabType.Console"
      :src="info.engineIcon"
      :alt="`${info.engineName} icon`"
      class="size-4 mr-1"
    />
    <SquareTerminalIcon
      v-else-if="info.type === TabType.Logger"
      class="size-4"
    />
    <TableIcon
      v-else-if="info.type === TabType.Query"
      class="size-4"
    />
    <FlowerIcon v-else class="size-4" />
    <TabTriggerDisplayName :tab-id="tabId" />
    <Button
      v-if="!info.preventClose"
      @click="handleClose"
      variant="ghost"
      size="xs"
      class="md:invisible group-hover:visible size-6 -mr-3"
      aria-label="Close Tab"
    >
      <XIcon class="size-3" />
    </Button>
  </button>
</template>

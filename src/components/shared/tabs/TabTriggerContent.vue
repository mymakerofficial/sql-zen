<script setup lang="ts">
import { useTabInfo } from '@/composables/tabs/useTabInfo'
import { FlowerIcon, XIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { TabType } from '@/lib/tabs/enums'
import { useTabManager } from '@/composables/useTabManager'

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
      class="size-4 min-w-max mr-1"
    />
    <FlowerIcon v-else class="size-4 min-w-max" />
    <span>{{ info.displayName }}</span>
    <Button
      @click="handleClose"
      variant="ghost"
      size="xs"
      class="md:invisible group-hover:visible size-6 -mr-3"
      aria-label="Close Tab"
    >
      <XIcon class="size-3 min-w-max" />
    </Button>
  </button>
</template>

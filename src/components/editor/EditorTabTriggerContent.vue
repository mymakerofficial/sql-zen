<script setup lang="ts">
import { useTabInfo } from '@/composables/tabs/useTabInfo'
import { FlowerIcon, XIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { tabManager } from '@/lib/tabs/manager'

const props = defineProps<{
  tabId: string
}>()

const info = useTabInfo(props.tabId)

function handleClose() {
  tabManager.removeTab(props.tabId)
}
</script>

<template>
  <button class="gap-2 group">
    <FlowerIcon class="size-4 min-w-max" />
    <span>{{ info.displayName }}</span>
    <Button
      @click="handleClose"
      variant="ghost"
      size="xs"
      class="invisible group-hover:visible size-6 -mr-3"
      aria-label="Close"
    >
      <XIcon class="size-3 min-w-max" />
    </Button>
  </button>
</template>

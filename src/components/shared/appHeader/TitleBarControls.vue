<script setup lang="ts">
import { getCurrentWindow } from '@tauri-apps/api/window'
import { Button } from '@/components/ui/button'
import { MinusIcon, SquareIcon, XIcon } from 'lucide-vue-next'

const appWindow = getCurrentWindow()

function handleMinimize() {
  appWindow.minimize()
}

function handleMaximize() {
  appWindow.toggleMaximize()
}

function handleClose() {
  appWindow.close()
}
</script>

<template>
  <div class="flex items-center h-full">
    <Button class="h-full rounded-none" variant="ghost" @click="handleMinimize">
      <MinusIcon class="size-4 min-h-max" />
    </Button>
    <Button class="h-full rounded-none" variant="ghost" @click="handleMaximize">
      <SquareIcon class="size-4 min-h-max" />
    </Button>
    <Button
      class="h-full rounded-none hover:bg-red-500"
      variant="ghost"
      @click="handleClose"
    >
      <XIcon class="size-4 min-h-max" />
    </Button>
  </div>
</template>

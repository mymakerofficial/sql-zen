<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { PlayIcon, EraserIcon } from 'lucide-vue-next'

defineProps<{
  disableRun?: boolean
}>()

const emit = defineEmits<{
  run: []
  clear: []
}>()

function handleRun() {
  emit('run')
}

function handleClear() {
  emit('clear')
}
</script>

<template>
  <section class="h-12 px-3 flex justify-between border-b border-border">
    <div class="h-full flex items-center">
      <Button
        @click="handleRun"
        :disabled="disableRun"
        size="sm"
        variant="ghost"
        class="gap-2"
      >
        <PlayIcon class="size-4" />
        <span>Run All</span>
      </Button>
    </div>
    <div class="h-full flex items-center">
      <Button @click="handleClear" size="sm" variant="ghost" class="gap-2">
        <EraserIcon class="size-4" />
      </Button>
    </div>
  </section>
</template>

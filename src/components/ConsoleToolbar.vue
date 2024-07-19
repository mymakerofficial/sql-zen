<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { PlayIcon, Trash2Icon } from 'lucide-vue-next'

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
      <Button @click="handleRun" size="sm" variant="ghost" class="gap-2">
        <PlayIcon class="size-4" />
        <span>Run All</span>
      </Button>
    </div>
    <div class="h-full flex items-center">
      <Button @click="handleClear" size="sm" variant="ghost" class="gap-2">
        <Trash2Icon class="size-4" />
      </Button>
    </div>
  </section>
</template>

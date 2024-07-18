<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { PlayIcon } from 'lucide-vue-next'

const emit = defineEmits<{
  run: []
}>()

function handleRun() {
  emit('run')
}
</script>

<template>
  <section class="h-12 px-3 flex items-center border-b border-border">
    <Button @click="handleRun" size="sm" variant="ghost" class="gap-2">
      <PlayIcon class="size-4" />
      <span>Run All</span>
    </Button>
  </section>
</template>

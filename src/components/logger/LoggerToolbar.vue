<script setup lang="ts">
import { Trash2Icon, ArrowDownAZIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

defineProps<{
  canClear: boolean
  canScrollDown: boolean
}>()

const emit = defineEmits<{
  clear: []
  down: []
}>()

function handleClear() {
  emit('clear')
}

function handleDown() {
  emit('down')
}
</script>

<template>
  <section class="h-full p-1 flex flex-col gap-1 border-l border-border">
    <Button
      @click="handleClear"
      :disabled="!canClear"
      size="xs"
      variant="ghost"
    >
      <Trash2Icon class="size-4" />
    </Button>
    <Button
      @click="handleDown"
      :disabled="!canScrollDown"
      size="xs"
      variant="ghost"
    >
      <ArrowDownAZIcon class="size-4" />
    </Button>
  </section>
</template>

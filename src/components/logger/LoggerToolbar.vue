<script setup lang="ts">
import { Trash2Icon, ArrowDownAZIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Toggle } from '@/components/ui/toggle'

const stickToBottom = defineModel<boolean>('stickToBottom')

defineProps<{
  canClear: boolean
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
      <Trash2Icon class="size-4 min-h-max" />
    </Button>
    <Toggle v-model:pressed="stickToBottom" size="xs">
      <ArrowDownAZIcon class="size-4 min-h-max" />
    </Toggle>
  </section>
</template>

<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const open = defineModel<boolean>('open', { required: true })

defineProps<{
  title?: string
  description?: string
}>()
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent>
      <DialogHeader v-if="title ?? $slots.title" class="mb-4">
        <DialogTitle
          v-if="title ?? $slots.title"
          class="flex items-center gap-2"
        >
          <slot name="title">{{ title }}</slot>
        </DialogTitle>
        <DialogDescription v-if="description ?? $slots.description">
          <slot name="description">{{ description }}</slot>
        </DialogDescription>
      </DialogHeader>
      <slot />
      <div v-if="$slots.footer" class="mt-1.5">
        <slot name="footer" />
      </div>
    </DialogContent>
  </Dialog>
</template>

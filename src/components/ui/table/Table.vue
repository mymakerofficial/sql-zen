<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <div class="relative flex-1 w-full overflow-auto">
    <table :class="cn('relative w-full caption-bottom text-sm', props.class)">
      <slot />
    </table>
  </div>
</template>

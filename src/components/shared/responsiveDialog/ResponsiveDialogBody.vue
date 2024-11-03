<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { useEnv } from '@/composables/useEnv'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const { isMediumScreen } = useEnv()
</script>

<template>
  <div v-if="isMediumScreen" :class="cn('overflow-y-auto', props.class)">
    <slot />
  </div>
  <div v-else :class="cn('px-4 overflow-y-auto', props.class)">
    <slot />
  </div>
</template>

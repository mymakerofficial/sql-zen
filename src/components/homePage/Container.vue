<script setup lang="ts">
import { Primitive, type PrimitiveProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<
  PrimitiveProps & {
    class: HTMLAttributes['class']
  }
>()
</script>

<template>
  <Primitive
    :class="cn('md:px-16 lg:px-28 mx-auto max-w-[2024px]', props.class)"
    v-bind="props"
  >
    <slot />
  </Primitive>
</template>

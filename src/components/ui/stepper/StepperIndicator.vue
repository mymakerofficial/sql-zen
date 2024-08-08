<script lang="ts" setup>
import { type HTMLAttributes, computed } from 'vue'
import type { StepperIndicatorProps } from 'radix-vue'
import { StepperIndicator, useForwardProps } from 'radix-vue'

import { cn } from '@/lib/utils'

const props = defineProps<
  StepperIndicatorProps & { class?: HTMLAttributes['class'] }
>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwarded = useForwardProps(delegatedProps)
</script>

<template>
  <div
    v-bind="forwarded"
    :class="
      cn(
        'inline-flex items-center justify-center rounded-full bg-accent w-10 h-1',
        // Disabled
        'group-data-[disabled]:text-muted-foreground group-data-[disabled]:opacity-50',
        // Active
        'group-data-[state=active]:bg-primary',
        // Completed
        'group-data-[state=completed]:bg-muted-foreground/50',
        props.class,
      )
    "
  >
    <slot />
  </div>
</template>

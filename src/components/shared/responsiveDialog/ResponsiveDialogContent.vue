<script setup lang="ts">
import { DialogScrollContent } from '@/components/ui/dialog'
import { DrawerContent } from '@/components/ui/drawer'
import {
  type DialogContentEmits,
  type DialogContentProps,
  useForwardPropsEmits,
} from 'radix-vue'
import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'vue'
import { useEnv } from '@/composables/useEnv'

const props = defineProps<
  DialogContentProps & {
    class?: HTMLAttributes['class']
  }
>()
const emits = defineEmits<DialogContentEmits>()

const { isMediumScreen } = useEnv()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <DialogScrollContent
    v-if="isMediumScreen"
    v-bind="forwarded"
    :class="props.class"
  >
    <slot />
  </DialogScrollContent>
  <DrawerContent
    v-else
    v-bind="forwarded"
    :class="cn('max-h-[calc(100vh-6.25rem)]', props.class)"
  >
    <slot />
  </DrawerContent>
</template>

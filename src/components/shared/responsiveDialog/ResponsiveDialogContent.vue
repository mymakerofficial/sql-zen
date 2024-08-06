<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core'
import { DialogContent } from '@/components/ui/dialog'
import { DrawerContent } from '@/components/ui/drawer'
import {
  type DialogContentEmits,
  type DialogContentProps,
  useForwardPropsEmits,
} from 'radix-vue'

const props = defineProps<DialogContentProps>()
const emits = defineEmits<DialogContentEmits>()

const desktop = useMediaQuery('(min-width: 768px)')

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <DialogContent v-if="desktop" v-bind="forwarded">
    <slot />
  </DialogContent>
  <DrawerContent v-else v-bind="forwarded">
    <slot />
  </DrawerContent>
</template>

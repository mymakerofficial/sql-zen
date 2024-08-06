<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core'
import { Dialog } from '@/components/ui/dialog'
import { Drawer } from '@/components/ui/drawer'
import {
  type DialogRootEmits,
  type DialogRootProps,
  useForwardPropsEmits,
} from 'radix-vue'

const props = defineProps<DialogRootProps>()
const emits = defineEmits<DialogRootEmits>()

const desktop = useMediaQuery('(min-width: 768px)')

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <Dialog v-if="desktop" v-bind="forwarded">
    <slot />
  </Dialog>
  <Drawer v-else v-bind="forwarded">
    <slot />
  </Drawer>
</template>

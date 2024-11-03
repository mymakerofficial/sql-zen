<script setup lang="ts">
import { Dialog } from '@/components/ui/dialog'
import { Drawer } from '@/components/ui/drawer'
import {
  type DialogRootEmits,
  type DialogRootProps,
  useForwardPropsEmits,
} from 'radix-vue'
import { useEnv } from '@/composables/useEnv'

const props = defineProps<DialogRootProps>()
const emits = defineEmits<DialogRootEmits>()

const { isMediumScreen } = useEnv()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <Dialog v-if="isMediumScreen" v-bind="forwarded">
    <slot />
  </Dialog>
  <Drawer v-else v-bind="forwarded">
    <slot />
  </Drawer>
</template>

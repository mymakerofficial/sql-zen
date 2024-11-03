<script setup lang="ts">
import { DialogFooter } from '@/components/ui/dialog'
import { DrawerFooter } from '@/components/ui/drawer'
import { useEnv } from '@/composables/useEnv'

const { isMediumScreen } = useEnv()
</script>

<template>
  <DialogFooter v-if="isMediumScreen">
    <slot />
  </DialogFooter>
  <DrawerFooter v-else>
    <slot />
  </DrawerFooter>
</template>

<script setup lang="ts">
import { DialogTitle } from '@/components/ui/dialog'
import { DrawerTitle } from '@/components/ui/drawer'
import { useEnv } from '@/composables/useEnv'

const { isMediumScreen } = useEnv()
</script>

<template>
  <DialogTitle v-if="isMediumScreen">
    <slot />
  </DialogTitle>
  <DrawerTitle v-else>
    <slot />
  </DrawerTitle>
</template>

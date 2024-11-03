<script setup lang="ts">
import { DialogHeader } from '@/components/ui/dialog'
import { DrawerHeader } from '@/components/ui/drawer'
import { useEnv } from '@/composables/useEnv'

const { isMediumScreen } = useEnv()
</script>

<template>
  <DialogHeader v-if="isMediumScreen">
    <slot />
  </DialogHeader>
  <DrawerHeader v-else>
    <slot />
  </DrawerHeader>
</template>

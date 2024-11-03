<script setup lang="ts">
import { DialogDescription } from '@/components/ui/dialog'
import { DrawerDescription } from '@/components/ui/drawer'
import { useEnv } from '@/composables/useEnv'

const { isMediumScreen } = useEnv()
</script>

<template>
  <DialogDescription v-if="isMediumScreen">
    <slot />
  </DialogDescription>
  <DrawerDescription v-else>
    <slot />
  </DrawerDescription>
</template>

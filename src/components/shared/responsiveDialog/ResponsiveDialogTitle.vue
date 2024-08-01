<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core'
import { DialogTitle } from '@/components/ui/dialog'
import { DrawerTitle } from '@/components/ui/drawer'

const desktop = useMediaQuery('(min-width: 768px)')
</script>

<template>
  <DialogTitle v-if="desktop">
    <slot />
  </DialogTitle>
  <DrawerTitle v-else>
    <slot />
  </DrawerTitle>
</template>

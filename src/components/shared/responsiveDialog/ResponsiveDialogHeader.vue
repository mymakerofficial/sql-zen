<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core'
import { DialogHeader } from '@/components/ui/dialog'
import { DrawerHeader } from '@/components/ui/drawer'

const desktop = useMediaQuery('(min-width: 768px)')
</script>

<template>
  <DialogHeader v-if="desktop">
    <slot />
  </DialogHeader>
  <DrawerHeader v-else>
    <slot />
  </DrawerHeader>
</template>

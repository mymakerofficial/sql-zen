<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core'
import { DialogFooter } from '@/components/ui/dialog'
import { DrawerFooter } from '@/components/ui/drawer'

const desktop = useMediaQuery('(min-width: 768px)')
</script>

<template>
  <DialogFooter v-if="desktop">
    <slot />
  </DialogFooter>
  <DrawerFooter v-else>
    <slot />
  </DrawerFooter>
</template>

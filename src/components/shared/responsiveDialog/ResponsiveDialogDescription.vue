<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core'
import { DialogDescription } from '@/components/ui/dialog'
import { DrawerDescription } from '@/components/ui/drawer'

const desktop = useMediaQuery('(min-width: 768px)')
</script>

<template>
  <DialogDescription v-if="desktop">
    <slot />
  </DialogDescription>
  <DrawerDescription v-else>
    <slot />
  </DrawerDescription>
</template>

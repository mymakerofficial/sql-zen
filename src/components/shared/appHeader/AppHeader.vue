<script setup lang="ts">
import ColorModeSelect from '@/components/shared/ColorModeSelect.vue'
import { Separator } from '@/components/ui/separator'
import AppHeaderMenu from '@/components/shared/appHeader/AppHeaderMenu.vue'
import LogoButton from '@/components/shared/appHeader/LogoButton.vue'
import DatabaseExplorerDrawer from '@/components/databaseExplorer/DatabaseExplorerDrawer.vue'
import { useMediaQuery } from '@vueuse/core'

const smallScreen = useMediaQuery('(max-width: 640px)')
</script>

<template>
  <nav
    class="relative h-16 px-3 flex items-center justify-between border-b border-border"
  >
    <div class="h-full flex items-center gap-3">
      <LogoButton />
      <Separator orientation="vertical" class="h-4" />
      <DatabaseExplorerDrawer v-if="smallScreen" />
      <AppHeaderMenu />
    </div>
    <div class="h-full flex items-center">
      <ColorModeSelect />
    </div>
  </nav>
</template>

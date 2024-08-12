<script setup lang="ts">
import ColorModeSelect from '@/components/shared/ColorModeSelect.vue'
import AppHeaderMenu from '@/components/shared/appHeader/AppHeaderMenu.vue'
import LogoButton from '@/components/shared/appHeader/LogoButton.vue'
import TitleBarControls from '@/components/shared/appHeader/TitleBarControls.vue'
import { isTauri } from '@tauri-apps/api/core'
import { cn } from '@/lib/utils'
</script>

<template>
  <nav
    data-tauri-drag-region
    :class="
      cn(
        'relative px-3 flex items-center justify-between border-b border-border',
        isTauri() ? 'h-12' : 'h-16',
      )
    "
  >
    <div class="h-full flex items-center gap-3">
      <LogoButton />
      <AppHeaderMenu />
    </div>
    <div class="h-full flex items-center gap-3">
      <ColorModeSelect />
      <TitleBarControls v-if="isTauri()" />
    </div>
  </nav>
</template>

<script setup lang="ts">
import ColorModeSelect from '@/components/shared/ColorModeSelect.vue'
import AppHeaderMenu from '@/components/shared/appHeader/AppHeaderMenu.vue'
import LogoButton from '@/components/shared/appHeader/LogoButton.vue'
import TitleBarControls from '@/components/shared/appHeader/TitleBarControls.vue'
import { cn } from '@/lib/utils'
import { useEnv } from '@/composables/useEnv'
import AppLogo from '@/components/shared/appHeader/AppLogo.vue'

const { isWindows, isTauri, isSmallScreen } = useEnv()
</script>

<template>
  <nav
    data-tauri-drag-region
    :class="
      cn(
        'relative flex items-center justify-between border-b border-border',
        isTauri ? 'h-12' : 'px-3 h-16',
      )
    "
  >
    <div class="h-full flex items-center gap-3">
      <AppLogo v-if="isTauri" class="ml-5" />
      <LogoButton v-else />
      <AppHeaderMenu v-if="!isSmallScreen" />
    </div>
    <div class="h-full flex items-center gap-3">
      <ColorModeSelect v-if="!isSmallScreen" />
      <TitleBarControls v-if="isWindows" />
    </div>
  </nav>
</template>

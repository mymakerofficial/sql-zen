<script setup lang="ts">
import ColorModeSelect from '@/components/shared/ColorModeSelect.vue'
import AppHeaderMenu from '@/components/shared/appHeader/AppHeaderMenu.vue'
import LogoButton from '@/components/shared/appHeader/LogoButton.vue'
import TitleBarControls from '@/components/shared/appHeader/TitleBarControls.vue'
import { cn } from '@/lib/utils'
import { useEnv } from '@/composables/useEnv'
import AppLogo from '@/components/shared/appHeader/AppLogo.vue'

const { isWindows, isMacOS, isTauri, isSmallScreen } = useEnv()
</script>

<template>
  <nav
    data-tauri-drag-region
    :class="
      cn(
        'relative flex items-center justify-between border-b border-border',
        isTauri ? 'h-12' : 'px-3 h-16',
        isMacOS ? 'pl-24' : ''
      )
    "
  >
    <div class="h-full flex items-center gap-3">
      <LogoButton v-if="!isTauri" />
      <AppLogo v-else-if="!isMacOS" class="ml-5" />
      <AppHeaderMenu v-if="!isSmallScreen" />
    </div>
    <div class="h-full flex items-center gap-3">
      <ColorModeSelect v-if="!isSmallScreen" />
      <TitleBarControls v-if="isWindows" />
    </div>
  </nav>
</template>

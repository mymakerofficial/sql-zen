<script setup lang="ts">
import ColorModeSelect from '@/components/shared/ColorModeSelect.vue'
import AppHeaderMenu from '@/components/shared/appHeader/AppHeaderMenu.vue'
import LogoButton from '@/components/shared/appHeader/LogoButton.vue'
</script>

<template>
  <nav
    class="relative h-16 px-3 flex items-center justify-between border-b border-border"
  >
    <div class="h-full flex items-center gap-3">
      <LogoButton />
      <AppHeaderMenu />
    </div>
    <div class="h-full flex items-center">
      <ColorModeSelect />
    </div>
  </nav>
</template>

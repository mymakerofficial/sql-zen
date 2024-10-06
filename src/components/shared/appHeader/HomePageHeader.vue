<script setup lang="ts">
import ColorModeSelect from '@/components/shared/ColorModeSelect.vue'
import LogoButton from '@/components/shared/appHeader/LogoButton.vue'
</script>

<template>
  <nav
    class="relative px-3 flex items-center justify-between border-b border-border h-16"
  >
    <div class="h-full flex items-center gap-3">
      <LogoButton />
    </div>
    <div class="h-full flex items-center gap-3">
      <ColorModeSelect />
    </div>
  </nav>
</template>

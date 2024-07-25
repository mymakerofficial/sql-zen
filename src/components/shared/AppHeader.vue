<script setup lang="ts">
import ColorModeSelect from '@/components/shared/ColorModeSelect.vue'
import { Button } from '@/components/ui/button'
</script>

<template>
  <nav
    class="relative h-16 px-3 flex items-center justify-between border-b border-border"
  >
    <span
      class="w-full sm:w-96 h-full absolute left-0 -z-10 bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0 sm:from-blue-500/20 sm:via-unset sm::to-blue-500/0"
    />
    <div class="h-full flex items-center gap-3">
      <slot />
    </div>
    <Button as-child variant="ghost" class="hover:bg-primary/5 sm:mr-auto">
      <RouterLink to="/">
        <span
          class="text-xl font-black bg-gradient-to-br from-primary to-blue-600 inline-block text-transparent bg-clip-text"
          >SqlZen</span
        >
      </RouterLink>
    </Button>
    <div class="h-full flex items-center">
      <ColorModeSelect />
    </div>
  </nav>
</template>

<script setup lang="ts">
import ColorModeSelect from '@/components/shared/ColorModeSelect.vue'
import { Button } from '@/components/ui/button'
</script>

<template>
  <nav class="relative h-16 px-3 flex justify-between border-b border-border">
    <div class="h-full flex items-center">
      <span
        class="w-96 h-full absolute left-0 -z-10 bg-gradient-to-r from-blue-500/20 to-blue-500/0"
      />
      <Button as-child variant="ghost" class="hover:bg-primary/5">
        <RouterLink to="/">
          <span
            class="text-xl font-black bg-gradient-to-br from-primary to-blue-600 inline-block text-transparent bg-clip-text"
            >SqlZen</span
          >
        </RouterLink>
      </Button>
    </div>
    <div class="h-full flex items-center">
      <ColorModeSelect />
    </div>
  </nav>
</template>

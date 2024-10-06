<script setup lang="ts">
import AppLogo from '@/components/shared/appHeader/AppLogo.vue'
import { Button } from '@/components/ui/button'
import EditorSidebar from '@/components/editor/EditorSidebar.vue'
import { MenuIcon } from 'lucide-vue-next'
import { useEnv } from '@/composables/useEnv'

const { isTauri, isMacOS } = useEnv()
</script>

<template>
  <div
    v-if="isTauri"
    data-tauri-drag-region
    class="px-3 h-12 flex items-center border-b border-border"
  >
    <AppLogo v-if="!isMacOS" class="ml-2" />
    <div class="ml-auto">
      <EditorSidebar>
        <Button variant="ghost" size="sm">
          <MenuIcon class="size-4 min-h-max" />
        </Button>
      </EditorSidebar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DownloadIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { useEnv } from '@/composables/useEnv'

const { isBrowser } = useEnv()
</script>

<template>
  <Button
    as-child
    v-if="isBrowser"
    variant="ghost"
    class="gap-3"
  >
    <RouterLink to="/download">
      <DownloadIcon class="size-4" />
      <span>Download App</span>
    </RouterLink>
  </Button>
</template>

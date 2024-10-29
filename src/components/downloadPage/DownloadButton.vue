<script setup lang="ts">
import type { Octokit } from 'octokit'
import { DownloadIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { computed } from 'vue'
import { Platform } from '@/composables/useEnv'
import { useSeline } from '@/composables/seline/seline'

const props = defineProps<{
  platform: Platform
  asset: Awaited<
    ReturnType<Octokit['rest']['repos']['getLatestRelease']>
  >['data']['assets'][number]
}>()

const { track } = useSeline()

const fileType = computed(() => {
  const name = props.asset.name
  if (name.endsWith('dmg')) return '.dmg'
  if (name.endsWith('exe')) return '.exe'
  if (name.endsWith('AppImage')) return 'AppImage'
  if (name.endsWith('deb')) return '.deb'
  if (name.endsWith('rpm')) return '.rpm'
  if (name.endsWith('msi')) return '.msi'
  if (name.endsWith('app.tar.gz')) return 'Portable'
  return name.split('.').pop()
})

const arch = computed(() => {
  const name = props.asset.name
  const platform = props.platform
  if (platform === Platform.MacOS && name.includes('x64')) return 'Intel Chip'
  if (platform === Platform.MacOS && name.includes('aarch64'))
    return 'Apple Silicon'
  if (platform === Platform.Windows && name.includes('x64')) return '64-bit'
  if (platform === Platform.Windows && name.includes('x86')) return '32-bit'
  if (name.includes('x86')) return '32-bit'
  if (
    name.includes('x64') ||
    name.includes('aarch64') ||
    name.includes('amd64')
  )
    return '64-bit'
  return ''
})

function handleClick() {
  track('downloaded-installer', {
    platform: props.platform,
    asset: props.asset.name,
  })
}
</script>

<template>
  <Button
    @click="handleClick"
    as-child
    variant="outline"
    class="justify-between gap-2 h-auto"
  >
    <a :href="asset.browser_download_url">
      <span class="flex flex-col gap-1">
        <span>Download {{ fileType }}</span>
        <span class="flex gap-2">
          <span class="text-xs" v-if="arch">{{ arch }}</span>
          <span class="text-xs text-muted-foreground">{{ asset.name }}</span>
        </span>
      </span>
      <DownloadIcon class="size-4" />
    </a>
  </Button>
</template>

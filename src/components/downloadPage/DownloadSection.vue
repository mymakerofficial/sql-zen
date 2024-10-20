<script setup lang="ts">
import type { Octokit } from 'octokit'
import DownloadButton from '@/components/downloadPage/DownloadButton.vue'
import { Platform } from '@/composables/useEnv'
import { computed } from 'vue'

const props = defineProps<{
  platform: Platform
  assets: Awaited<
    ReturnType<Octokit['rest']['repos']['getLatestRelease']>
  >['data']['assets']
}>()

const platformName = computed(() => {
  if (props.platform === Platform.Windows) return 'Windows'
  if (props.platform === Platform.MacOS) return 'macOS'
  if (props.platform === Platform.Linux) return 'Linux'
  return 'Unknown'
})
</script>

<template>
  <div class="flex flex-col gap-2">
    <h3 class="text-lg font-bold">{{ platformName }}</h3>
    <div class="flex flex-col gap-2">
      <DownloadButton
        v-for="asset in assets"
        :key="asset.id"
        :platform="platform"
        :asset="asset"
      />
    </div>
  </div>
</template>

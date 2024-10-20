<script setup lang="ts">
import Container from '@/components/homePage/Container.vue'
import HomePageHeader from '@/components/homePage/HomePageHeader.vue'
import AppIcon from '@/components/shared/appHeader/AppIcon.vue'
import { LoaderCircleIcon } from 'lucide-vue-next'
import { useGetLatestRelease } from '@/composables/useOktokit'
import { computed } from 'vue'
import DownloadSection from '@/components/downloadPage/DownloadSection.vue'
import { Platform } from '@/composables/useEnv'

const { data, isPending } = useGetLatestRelease()

const windowsAssets = computed(() => {
  if (!data.value) return []
  return data.value.assets.filter(
    (asset: any) => asset.name.endsWith('.exe') || asset.name.endsWith('.msi'),
  )
})

const macosAssets = computed(() => {
  if (!data.value) return []
  return data.value.assets.filter(
    (asset: any) =>
      asset.name.endsWith('.dmg') || asset.name.endsWith('.app.tar.gz'),
  )
})

const linuxAssets = computed(() => {
  if (!data.value) return []
  return data.value.assets.filter(
    (asset: any) =>
      asset.name.endsWith('.AppImage') ||
      asset.name.endsWith('.deb') ||
      asset.name.endsWith('.rpm'),
  )
})
</script>

<template>
  <HomePageHeader />
  <Container as="main" class="flex gap-12 px-6 py-8 md:py-[10vh]">
    <div class="w-20 hidden lg:block">
      <AppIcon />
    </div>
    <div v-if="isPending" class="flex items-center gap-3">
      <LoaderCircleIcon class="size-6 animate-spin" />
      <p class="text-lg font-medium">Loading available downloads...</p>
    </div>
    <div v-else-if="data" class="flex flex-col gap-8 lg:max-w-screen-sm">
      <div class="flex flex-col gap-2">
        <h1 class="text-4xl font-bold">Download SqlZen</h1>
        <div class="font-medium flex gap-2">
          <p>
            {{ data.name }}
          </p>
          <time class="text-muted-foreground">
            released
            {{
              new Date(data.published_at as string).toLocaleDateString(
                'en-US',
                {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                },
              )
            }}
          </time>
        </div>
      </div>
      <div>
        <p class="text-md font-medium leading-8 text-muted-foreground">
          SqlZen releases for Windows and macOS are
          <span class="text-foreground">unsigned</span>. You may need to bypass
          security warnings to install the app.
        </p>
      </div>
      <div class="flex flex-col gap-8">
        <DownloadSection :platform="Platform.Windows" :assets="windowsAssets" />
        <DownloadSection :platform="Platform.MacOS" :assets="macosAssets" />
        <DownloadSection :platform="Platform.Linux" :assets="linuxAssets" />
      </div>
    </div>
    <div v-else class="flex items-center gap-3">
      <div class="flex flex-col gap-2">
        <h1 class="text-4xl font-bold">No Downloads Available</h1>
        <p class="text-muted-foreground font-medium">
          There was an error fetching the latest release. Please try again
          later.
        </p>
      </div>
    </div>
  </Container>
</template>

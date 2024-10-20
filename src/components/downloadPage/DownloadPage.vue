<script setup lang="ts">
import Container from '@/components/homePage/Container.vue'
import HomePageHeader from '@/components/homePage/HomePageHeader.vue'
import AppIcon from '@/components/shared/appHeader/AppIcon.vue'
import { LoaderCircleIcon } from 'lucide-vue-next'
import { useGetLatestRelease } from '@/composables/useOktokit'
import { computed, ref } from 'vue'
import DownloadSection from '@/components/downloadPage/DownloadSection.vue'
import { Platform } from '@/composables/useEnv'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const whyUnsigned = ref<HTMLElement | null>(null)

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

const versionName = computed(() => {
  if (!data.value) return ''
  return data.value.name
})

const releaseDate = computed(() => {
  if (!data.value) return ''
  return new Date(data.value.published_at as string).toLocaleDateString(
    'en-US',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    },
  )
})

function scrollToWhyUnsigned() {
  whyUnsigned.value?.scrollIntoView({ behavior: 'smooth' })
}
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
            {{ versionName }}
          </p>
          <p class="text-muted-foreground">
            released <time>{{ releaseDate }}</time>
          </p>
          <Button as="a" :href="data.html_url" variant="link" size="none">
            View on GitHub
          </Button>
        </div>
      </div>
      <Separator />
      <div>
        <p class="text-md font-medium leading-8 text-muted-foreground">
          SqlZen is an <span class="text-foreground">open-source</span> project.
          You can view the source code and contribute on
          <Button
            as="a"
            href="https://github.com/mymakerofficial/sql-zen"
            target="_blank"
            variant="link"
            size="none"
          >
            GitHub</Button
          >.
        </p>
      </div>
      <div>
        <p class="text-md font-medium leading-8 text-muted-foreground">
          SqlZen releases for Windows and macOS are
          <span class="text-foreground">unsigned</span>. You may need to bypass
          security warnings to install the app.
          <Button @click="scrollToWhyUnsigned" variant="link" size="none">
            Learn more
          </Button>
        </p>
      </div>
      <Separator />
      <div class="flex flex-col gap-8">
        <DownloadSection :platform="Platform.Windows" :assets="windowsAssets" />
        <DownloadSection :platform="Platform.MacOS" :assets="macosAssets" />
        <DownloadSection :platform="Platform.Linux" :assets="linuxAssets" />
      </div>
      <Separator />
      <div
        ref="whyUnsigned"
        class="flex flex-col gap-4 text-md font-medium leading-8 text-muted-foreground"
      >
        <h3 class="text-foreground text-2xl font-bold">
          Why is SqlZen unsigned?
        </h3>
        <p>
          SqlZen is an open-source project and does not have a code-signing
          certificate. This means that Windows and macOS will display security
          warnings when you try to install the app.
          <span class="text-foreground">
            You can safely bypass these warnings and install the app.
          </span>
        </p>
        <p>
          Note you should always make sure to
          <span class="text-foreground">
            only download SqlZen from the
            <Button
              as="a"
              href="https://sqlzen.com"
              target="_blank"
              variant="link"
              size="none"
            >
              official website</Button
            >
            or
            <Button
              as="a"
              href="https://github.com/mymakerofficial/sql-zen"
              target="_blank"
              variant="link"
              size="none"
            >
              GitHub repository</Button
            >!
          </span>
        </p>
        <h3 class="mt-4 text-foreground text-2xl font-bold">
          How to bypass security warnings
        </h3>
        <div class="flex flex-col gap-2">
          <h3 class="text-lg font-bold text-foreground">Windows</h3>
          <p>
            To bypass security warnings on Windows, in the "Windows protected
            your PC" screen, click
            <span class="text-foreground">"More info"</span> and then
            <span class="text-foreground">"Run anyway"</span>.
          </p>
        </div>
        <div class="flex flex-col gap-2">
          <h3 class="text-lg font-bold text-foreground">macOS</h3>
          <ol>
            <li>
              1. Right-click the app and select
              <span class="text-foreground">"Open"</span>.
            </li>
            <li>
              2. Your Mac will tell you that the app could not be opened. Click
              <span class="text-foreground">"Done"</span>.
            </li>
            <li>
              3. In
              <span class="text-foreground">
                System Preferences > Security & Privacy
              </span>
              click
              <span class="text-foreground">"Open Anyway"</span>
              next to "SqlZen was blocked to protect your Mac".
            </li>
          </ol>
        </div>
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

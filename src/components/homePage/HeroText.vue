<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { MousePointer2Icon, DownloadIcon } from 'lucide-vue-next'
import ClickTheButton from '@/assets/click-the-button.svg?raw'
</script>

<template>
  <section class="flex flex-col gap-12">
    <div class="flex flex-col gap-4 md:gap-8">
      <h1 class="text-4xl md:text-5xl flex items-center gap-3 md:gap-5">
        <img
          src="@/assets/sql-zen-logo.svg"
          alt="SqlZen"
          class="inline size-10 md:size-14"
        />
        <span
          class="bg-gradient-to-br from-blue-200 to-blue-600 inline-block text-transparent bg-clip-text leading-normal font-black"
          >SqlZen</span
        >
      </h1>
      <h2 class="text-2xl md:text-4xl font-bold leading-10">
        Database tooling that runs everywhere.
      </h2>
      <p class="text-lg font-medium leading-8 text-muted-foreground">
        SqlZen lets you run your favourite databases right in your browser.
        Create and manage as many databases as you want, everything stays on
        your device.
      </p>
    </div>
    <div class="flex flex-wrap gap-3 mt-6">
      <div class="relative">
        <span
          v-html="ClickTheButton"
          class="absolute -top-3 -translate-y-10 translate-x-1/2 [&_path]:!stroke-current [&_text]:!fill-current"
        />
        <Button as-child size="lg" class="gap-3">
          <RouterLink to="/app">
            <MousePointer2Icon class="size-4 min-h-max" />
            <span>Get Started</span>
          </RouterLink>
        </Button>
      </div>
      <Button size="lg" variant="secondary" class="gap-3">
        <DownloadIcon class="size-4 min-h-max" />
        <span>Download for Windows</span>
        <span class="text-xs">soon</span>
      </Button>
    </div>
  </section>
</template>

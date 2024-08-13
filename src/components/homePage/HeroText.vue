<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { MousePointer2Icon, DownloadIcon } from 'lucide-vue-next'
</script>

<template>
  <section class="flex flex-col gap-12">
    <div class="flex flex-col gap-4 md:gap-8">
      <h1 class="text-4xl md:text-5xl">
        <img
          src="@/assets/sql-zen-logo.svg"
          alt="SqlZen"
          class="inline size-10 mr-3 -mt-2 md:size-14 md:mr-5 md:-mt-2"
        />
        <span
          class="bg-gradient-to-br from-blue-200 to-blue-600 inline-block text-transparent bg-clip-text leading-normal font-black"
          >SqlZen</span
        >
      </h1>
      <h2 class="text-2xl md:text-4xl font-bold leading-10">
        The Database IDE in the Browser.
      </h2>
      <p class="text-lg font-medium leading-8 text-muted-foreground">
        SqlZen lets you run your favourite databases right in your browser.
        Create and manage as many databases as you want, everything stays on
        your machine.
      </p>
    </div>
    <div class="flex flex-wrap gap-3">
      <Button as-child size="lg" class="gap-3">
        <RouterLink to="/app">
          <MousePointer2Icon class="size-4 min-h-max" />
          <span>Get Started</span>
        </RouterLink>
      </Button>
      <Button size="lg" variant="secondary" class="gap-3">
        <DownloadIcon class="size-4 min-h-max" />
        <span>Download for Windows</span>
        <span class="text-xs">soon</span>
      </Button>
    </div>
  </section>
</template>

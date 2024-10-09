<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { DownloadIcon, ExternalLinkIcon } from 'lucide-vue-next'
</script>

<template>
  <section class="flex flex-col gap-12">
    <div class="flex flex-col gap-4 md:gap-8">
      <h2 class="text-2xl md:text-4xl font-bold leading-10">
        Database tooling that runs everywhere.
      </h2>
      <p class="text-lg font-medium">From playground to production.</p>
      <p class="text-lg font-medium leading-8 text-muted-foreground">
        Create and experiment with virtual
        <span class="text-foreground">databases in your browser</span>. Once
        you're ready for more,
        <span class="text-foreground">download the app</span> and use the same
        editor to <span class="text-foreground">connect to any database</span>.
      </p>
    </div>
    <div class="flex flex-wrap gap-6 mt-6">
      <Button as-child size="lg" class="gap-3 text-md py-6">
        <RouterLink to="/app">
          <ExternalLinkIcon class="size-4" />
          <span>Open in your browser</span>
        </RouterLink>
      </Button>
      <Button as-child size="lg" variant="secondary" class="gap-3 text-md py-6">
        <a href="https://github.com/mymakerofficial/sql-zen" target="_blank">
          <DownloadIcon class="size-4" />
          <span>Get for Windows</span>
        </a>
      </Button>
    </div>
  </section>
</template>

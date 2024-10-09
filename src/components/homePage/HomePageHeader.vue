<script setup lang="ts">
import ColorModeSelect from '@/components/shared/ColorModeSelect.vue'
import Container from '@/components/homePage/Container.vue'
import AppLogo from '@/components/shared/appHeader/AppLogo.vue'
import { Button } from '@/components/ui/button'
import { GithubIcon } from 'lucide-vue-next'
</script>

<template>
  <nav class="sticky top-0 bg-background border-b border-border h-16 z-50">
    <Container class="px-6 h-full flex items-center justify-between">
      <div class="h-full flex items-center gap-3">
        <AppLogo />
      </div>
      <div class="h-full flex items-center gap-3">
        <Button as-child variant="ghost" class="gap-3">
          <a href="https://github.com/mymakerofficial/sql-zen" target="_blank">
            <GithubIcon class="size-5" />
            Star on GitHub
          </a>
        </Button>
        <ColorModeSelect />
      </div>
    </Container>
  </nav>
</template>

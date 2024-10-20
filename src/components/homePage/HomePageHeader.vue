<script setup lang="ts">
import ColorModeSelect from '@/components/shared/ColorModeSelect.vue'
import Container from '@/components/homePage/Container.vue'
import { Button } from '@/components/ui/button'
import LogoButton from '@/components/shared/appHeader/LogoButton.vue'
</script>

<template>
  <nav class="sticky top-0 bg-background border-b border-border h-16 z-50">
    <Container class="px-6 h-full flex items-center justify-between">
      <div class="h-full flex items-center gap-3">
        <LogoButton class="-ml-3" />
      </div>
      <div class="h-full flex items-center gap-3">
        <Button as-child variant="ghost" class="hidden lg:flex">
          <a href="https://github.com/mymakerofficial/sql-zen" target="_blank">
            Star on GitHub
          </a>
        </Button>
        <Button as-child variant="ghost" class="hidden lg:flex">
          <RouterLink to="/download">
            <span>Download</span>
          </RouterLink>
        </Button>
        <ColorModeSelect />
      </div>
    </Container>
  </nav>
</template>

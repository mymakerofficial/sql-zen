<script setup lang="ts">
import { Button } from '@/components/ui/button'
import AppLogo from '@/components/shared/appHeader/AppLogo.vue'
</script>

<template>
  <Button as-child variant="ghost" class="min-w-max">
    <RouterLink to="/">
      <AppLogo />
    </RouterLink>
  </Button>
</template>

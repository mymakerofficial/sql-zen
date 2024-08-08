<script setup lang="ts">
import { Button } from '@/components/ui/button'
</script>

<template>
  <Button as-child variant="ghost" class="min-w-max">
    <RouterLink to="/">
      <img
        src="@/assets/sql-zen-logo.svg"
        alt="SqlZen"
        class="inline size-6 min-w-max md:mr-3"
      />
      <span
        class="hidden md:inline-block text-xl bg-gradient-to-br from-blue-200 to-blue-600 text-transparent bg-clip-text font-black"
        >SqlZen</span
      >
    </RouterLink>
  </Button>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import DialogProvider from '@/components/shared/dialog/DialogProvider.vue'
import { useQueryClient } from '@tanstack/vue-query'

const queryClient = useQueryClient()

queryClient.setDefaultOptions({
  queries: {
    refetchOnWindowFocus: false,
    retry: false,
  },
})
</script>

<template>
  <DialogProvider />
  <RouterView />
</template>

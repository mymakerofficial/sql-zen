<script setup lang="ts">
import { RouterView, useRoute, useRouter } from 'vue-router'
import DialogProvider from '@/components/shared/dialog/DialogProvider.vue'
import { useQueryClient } from '@tanstack/vue-query'
import AppHeader from '@/components/shared/appHeader/AppHeader.vue'
import { isTauri } from '@tauri-apps/api/core'

const queryClient = useQueryClient()

queryClient.setDefaultOptions({
  queries: {
    refetchOnWindowFocus: false,
    retry: false,
  },
})

const route = useRoute()
const router = useRouter()
if (isTauri() && route.path === '/') {
  router.replace('/app')
}
</script>

<template>
  <DialogProvider />
  <div vaul-drawer-wrapper class="bg-background h-screen flex flex-col">
    <AppHeader :active-data-source="null" />
    <main class="flex-1 overflow-auto">
      <RouterView />
    </main>
  </div>
</template>

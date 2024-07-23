<script setup lang="ts">
import { RouterView } from 'vue-router'
import DialogProvider from '@/components/shared/dialog/DialogProvider.vue'
</script>

<template>
  <DialogProvider />
  <RouterView />
</template>

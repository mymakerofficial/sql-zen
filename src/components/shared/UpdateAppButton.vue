<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { DownloadIcon, LoaderCircleIcon } from 'lucide-vue-next'
import {
  useCheckForUpdates,
  useInstallUpdate,
} from '@/composables/appUpdate/useAppUpdate'

const { data } = useCheckForUpdates()
const { mutate: update, isPending } = useInstallUpdate()
</script>

<template>
  <Button
    v-if="data.available"
    @click="update"
    :disabled="isPending"
    variant="success"
    class="gap-3"
  >
    <LoaderCircleIcon v-if="isPending" class="size-4 animate-spin" />
    <DownloadIcon v-else class="size-4" />
    <span>Update Available</span>
  </Button>
</template>

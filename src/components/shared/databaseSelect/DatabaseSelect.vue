<script setup lang="ts">
import EmbeddedDatabaseSelect from '@/components/shared/databaseSelect/EmbeddedDatabaseSelect.vue'
import { useDatabaseSystem } from '@/composables/useDatabaseSystem'

const selected = useDatabaseSystem()
</script>

<template>
  <EmbeddedDatabaseSelect v-model="selected" />
</template>

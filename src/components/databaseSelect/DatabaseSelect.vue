<script setup lang="ts">
import EmbeddedDatabaseSelect from '@/components/databaseSelect/EmbeddedDatabaseSelect.vue'
import { useDatabaseSystem } from '@/composables/useDatabaseSystem'

const selected = useDatabaseSystem()
</script>

<template>
  <EmbeddedDatabaseSelect v-model="selected" />
</template>

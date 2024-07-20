<script setup lang="ts">
import DatabaseSelectItemContent from '@/components/databaseSelect/DatabaseSelectItemContent.vue'
import { databaseSystemsList } from '@/lib/databaseSystems'
import { useDatabaseSystem } from '@/composables/useDatabaseSystem'

const database = useDatabaseSystem()
</script>

<template>
  <div class="h-screen flex flex-col">
    <main class="flex-1 p-6 md:flex md:items-center md:justify-center">
      <div class="flex flex-col gap-12 lg:w-[32rem]">
        <div class="flex flex-col gap-3">
          <h1 class="text-4xl font-bold">Welcome to <span class="bg-gradient-to-r from-blue-600 to-indigo-400 inline-block text-transparent bg-clip-text">SqlZen</span></h1>
          <p class="text-lg">Play with your favourite databases right in your browser.</p>
        </div>
        <div class="flex flex-col gap-3">
          <p class="text-sm font-medium text-muted-foreground">Select a database to get going.</p>
          <div class="flex flex-col gap-4">
            <button v-for="item in databaseSystemsList" @click="database = item.key" :key="item.key" class="rounded-md p-3 hover:bg-accent text-left">
              <DatabaseSelectItemContent v-bind="item" />
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
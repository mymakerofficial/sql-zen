<script setup lang="ts">
import DatabaseSelectItemContent from '@/components/shared/databaseSelect/DatabaseSelectItemContent.vue'
import { databaseSystemsList } from '@/lib/databaseSystems'
import ColorModeSelect from '@/components/shared/ColorModeSelect.vue'
</script>

<template>
  <div class="h-screen flex flex-col">
    <div
      class="hidden h-16 px-3 md:flex justify-end items-center border-b border-border"
    >
      <ColorModeSelect />
    </div>
    <main class="flex-1 p-6 md:flex md:items-center md:justify-center">
      <div class="flex flex-col gap-12 lg:w-[32rem]">
        <div class="flex flex-col gap-3">
          <h1 class="text-4xl font-bold">
            <span
              class="bg-gradient-to-br from-primary to-blue-600 inline-block text-transparent bg-clip-text font-black"
              >SqlZen</span
            >
            lets you play with your favourite databases in the browser.
          </h1>
        </div>
        <div class="flex flex-col gap-7">
          <p class="text-sm font-medium text-muted-foreground">
            Select a database to get going.
          </p>
          <div class="flex flex-col gap-4">
            <RouterLink
              v-for="item in databaseSystemsList"
              :to="item.baseRoute"
              :key="item.key"
              class="rounded-md p-3 hover:bg-accent text-left"
            >
              <DatabaseSelectItemContent v-bind="item" />
            </RouterLink>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

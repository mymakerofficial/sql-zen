<script setup lang="ts">
import { selectableDatabaseEngines } from '@/lib/engines/constants.js'
</script>

<template>
  <section class="flex flex-col gap-4 md:gap-8">
    <div class="px-6 md:p-0 flex flex-col gap-4 md:gap-8">
      <h3 class="text-4xl font-semibold">Supported Databases</h3>
      <p class="text-lg font-medium leading-8 text-muted-foreground">
        A database for every need.
      </p>
    </div>
    <div
      class="overflow-x-auto w-full snap-mandatory snap-x flex md:flex-wrap gap-12 px-[50vw] md:px-0"
    >
      <div
        v-for="info in selectableDatabaseEngines"
        :key="info.name"
        class="scroll-ml-6 snap-start relative w-60 min-w-60 h-60 border rounded-md flex flex-col items-center justify-center gap-8 p-4 overflow-hidden"
      >
        <img :src="info.icon" :alt="info.name" class="size-12 select-none" />
        <h4 class="text-lg font-semibold">{{ info.name }}</h4>
      </div>
    </div>
  </section>
</template>

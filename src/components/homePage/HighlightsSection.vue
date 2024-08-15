<script setup lang="ts">
import DatabaseExplorerItem from '@/components/databaseExplorer/DatabaseExplorerItem.vue'
import HighlightsItem from '@/components/homePage/HighlightsItem.vue'
import { SparklesIcon } from 'lucide-vue-next'
import EmbeddedDSTree from '@/components/databaseExplorer/EmbeddedDSTree.vue'
import { exampleDSTree } from '@/components/homePage/constants'
</script>

<template>
  <section class="p-6 md:p-0 flex flex-col gap-4 md:gap-8">
    <div class="flex flex-col gap-4 md:gap-8 items-end">
      <p class="text-lg font-medium leading-8 text-muted-foreground">
        <i>almost</i>
      </p>
      <h3 class="text-4xl font-semibold">All you could ever want</h3>
    </div>
    <div class="flex flex-col md:flex-row justify-end gap-12">
      <HighlightsItem>
        <template #panel>
          <div class="absolute w-2/3 left-1/2 -translate-x-1/2 top-6">
            <EmbeddedDSTree
              :items="exampleDSTree"
              :default-expanded="['mydb', 'mydb-main', 'mydb-main-__tables__']"
            />
          </div>
        </template>
        <template #description>
          <h3 class="text-xl font-semibold">Explore your Database</h3>
          <p class="text-muted-foreground">
            Browse your database schema, tables, columns, and more.
          </p>
        </template>
      </HighlightsItem>
      <HighlightsItem>
        <template #panel>
          <div class="flex items-center justify-center h-full">
            <div class="flex items-center gap-4 z-10">
              <SparklesIcon class="size-5 min-h-max text-purple-300" />
              <span
                class="text-lg font-bold bg-gradient-to-br from-purple-300 to-violet-200 text-transparent bg-clip-text"
                >Embeddings</span
              >
            </div>
          </div>
        </template>
        <template #description>
          <h3 class="text-xl font-semibold">Search your Database</h3>
          <p class="text-muted-foreground">
            Use the power of embeddings to perform semantic and similarity
            searches on your data.
          </p>
        </template>
      </HighlightsItem>
    </div>
  </section>
</template>

<script setup lang="ts">
import HighlightsItem from '@/components/homePage/HighlightsItem.vue'
import { BadgeInfoIcon, SparklesIcon } from 'lucide-vue-next'
import EmbeddedDSTree from '@/components/databaseExplorer/EmbeddedDSTree.vue'
import { exampleDSTree } from '@/components/homePage/constants'
import CodeBlock from '@/components/shared/CodeBlock.vue'
import { ref } from 'vue'

const itemsDDLExample = `CREATE TYPE item_category AS ENUM ('artifacts', 'gadgets', 'apparel', 'pets');

CREATE TYPE inventory_item AS (
    name text,
    categories item_category[],
    price numeric
);`

const badgesDDLExample = `CREATE TYPE player_badge AS ENUM ('sage', 'explorer', 'master', 'crafter');`

const ddlExample = ref<string>(itemsDDLExample)

function setDDLExample(value: string) {
  ddlExample.value = value
}
</script>

<template>
  <section class="p-6 md:p-0 flex flex-col gap-4 md:gap-8">
    <div class="flex flex-col gap-4 md:gap-8 items-end">
      <p class="text-lg font-medium leading-8 text-muted-foreground">
        <i>almost</i>
      </p>
      <h3 class="text-4xl font-semibold">All you could ever want</h3>
    </div>
    <div class="flex flex-col md:flex-row flex-wrap justify-end gap-12">
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
      <HighlightsItem>
        <template #panel>
          <div
            class="flex flex-col justify-end h-full w-full space-y-4 scale-[80%]"
          >
            <div
              class="md:translate-x-[15%] w-min space-y-2 rounded-md md:border md:bg-popover p-4 text-popover-foreground md:shadow-md"
            >
              <h3 class="flex items-center gap-2 text-muted-foreground">
                <BadgeInfoIcon class="size-4" />
                <span>auto-generated type definition</span>
              </h3>
              <CodeBlock :code="ddlExample" class="[&_pre]:!bg-transparent" />
            </div>
            <div class="hidden md:block w-[200%] -translate-x-1/4 border-t p-4">
              <div class="flex items-center gap-20 translate-x-[30%]">
                <span class="flex items-center gap-2">
                  <span>player_name</span>
                  <span class="text-xs font-normal"> text </span>
                </span>
                <span class="flex items-center gap-2">
                  <span>items</span>
                  <span
                    class="flex items-center gap-2 text-xs font-normal hover:underline cursor-pointer"
                    @mouseover="setDDLExample(itemsDDLExample)"
                  >
                    <span>inventory_item[]</span>
                    <BadgeInfoIcon class="size-4" />
                  </span>
                </span>
                <span class="flex items-center gap-2">
                  <span>badges</span>
                  <span
                    class="flex items-center gap-2 text-xs font-normal hover:underline cursor-pointer"
                    @mouseover="setDDLExample(badgesDDLExample)"
                  >
                    <span>player_badge[]</span>
                    <BadgeInfoIcon class="size-4" />
                  </span>
                </span>
              </div>
            </div>
          </div>
        </template>
        <template #description>
          <h3 class="text-xl font-semibold">Know your Types</h3>
          <p class="text-muted-foreground">
            SqlZen automatically displays DDL type definitions for complex
            types, so you always know what you're looking at.
          </p>
        </template>
      </HighlightsItem>
    </div>
  </section>
</template>

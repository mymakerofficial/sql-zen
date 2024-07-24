<script setup lang="ts">
import { TreeItem, TreeRoot } from 'radix-vue'
import {
  BlocksIcon,
  DatabaseIcon,
  TableIcon,
  TablePropertiesIcon,
} from 'lucide-vue-next'
import { type SchemaTreeItem, SchemaTreeItemType } from '@/lib/dialect/dialect'

defineProps<{
  items: SchemaTreeItem[]
}>()
</script>

<template>
  <TreeRoot
    v-slot="{ flattenItems }"
    :items="items"
    :get-key="(item) => item.name"
    :default-expanded="[]"
    class="text-sm font-medium"
  >
    <TreeItem
      v-for="item in flattenItems"
      v-slot="{}"
      :key="item._id"
      :style="{ 'padding-left': `${item.level * 1.5 - 0.5}rem` }"
      v-bind="item.bind"
      class="flex items-center gap-3 py-1 my-1 rounded outline-none ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <DatabaseIcon
        v-if="item.value.type === SchemaTreeItemType.Catalog"
        class="size-4 min-w-max text-blue-500"
      />
      <BlocksIcon
        v-else-if="item.value.type === SchemaTreeItemType.Schema"
        class="size-4 min-w-max text-muted-foreground"
      />
      <TableIcon
        v-else-if="item.value.type === SchemaTreeItemType.Table"
        class="size-4 min-w-max text-muted-foreground"
      />
      <TablePropertiesIcon
        v-else-if="item.value.type === SchemaTreeItemType.Column"
        class="size-4 min-w-max text-muted-foreground"
      />
      <div>
        {{ item.value.name }}
      </div>
      <div
        v-if="item.value.type === SchemaTreeItemType.Column"
        class="font-normal text-muted-foreground"
      >
        {{ item.value.dataType }}
      </div>
    </TreeItem>
  </TreeRoot>
</template>

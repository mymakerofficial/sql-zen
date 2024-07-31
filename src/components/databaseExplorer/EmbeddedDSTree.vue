<script setup lang="ts">
import { TreeItem, TreeRoot } from 'radix-vue'
import {
  BlocksIcon,
  DatabaseIcon,
  FolderIcon,
  FolderOpenIcon,
  TableIcon,
  TablePropertiesIcon,
  SquareFunctionIcon,
  ToyBrickIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from 'lucide-vue-next'
import type { DSTreeItem } from '@/lib/dialect/interface'
import { DSTreeItemType } from '@/lib/dialect/enums'

defineProps<{
  items: DSTreeItem[]
}>()
</script>

<template>
  <TreeRoot
    v-slot="{ flattenItems }"
    :items="items"
    :get-key="(item) => item.key"
    :default-expanded="['__databases__', '__schemas__']"
    class="text-sm font-medium"
  >
    <TreeItem
      v-for="item in flattenItems"
      v-slot="{ isExpanded }"
      :key="item._id"
      :style="{ 'padding-left': `${item.level + 1}rem` }"
      v-bind="item.bind"
      class="cursor-pointer flex flex-col gap-1.5 py-1 my-1 rounded outline-none ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:bg-accent hover:text-accent-foreground"
    >
      <span class="flex items-center gap-2">
        <template v-if="'children' in item.value && item.value.children.length">
          <ChevronDownIcon
            v-if="isExpanded"
            class="relative -ml-6 size-4 min-w-max text-muted-foreground"
          />
          <ChevronRightIcon
            v-else
            class="relative -ml-6 size-4 min-w-max text-muted-foreground"
          />
        </template>
        <span class="relative">
          <template v-if="item.value.type === DSTreeItemType.Collection">
            <FolderOpenIcon
              v-if="isExpanded"
              class="size-4 min-w-max text-blue-500"
            />
            <FolderIcon v-else class="size-4 min-w-max text-blue-500" />
          </template>
          <ToyBrickIcon
            v-else-if="item.value.type === DSTreeItemType.Extension"
            class="size-4 min-w-max text-muted-foreground"
          />
          <DatabaseIcon
            v-else-if="item.value.type === DSTreeItemType.Database"
            class="size-4 min-w-max text-blue-500"
          />
          <BlocksIcon
            v-else-if="item.value.type === DSTreeItemType.Schema"
            class="size-4 min-w-max text-muted-foreground"
          />
          <TableIcon
            v-else-if="item.value.type === DSTreeItemType.Table"
            class="size-4 min-w-max text-muted-foreground"
          />
          <TableIcon
            v-else-if="item.value.type === DSTreeItemType.View"
            class="size-4 min-w-max text-muted-foreground"
          />
          <SquareFunctionIcon
            v-else-if="item.value.type === DSTreeItemType.Function"
            class="size-4 min-w-max text-muted-foreground"
          />
          <TablePropertiesIcon
            v-else-if="item.value.type === DSTreeItemType.Column"
            class="size-4 min-w-max text-muted-foreground"
          />
          <span
            v-if="item.value.type === DSTreeItemType.Extension"
            :data-state="item.value.loaded ? 'on' : 'off'"
            class="block absolute -top-1 -right-1 size-1.5 rounded-full data-[state=on]:bg-green-500 data-[state=off]:bg-red-500"
          />
        </span>
        <span class="truncate">
          {{ item.value.name }}
        </span>
        <span
          v-if="item.value.type === DSTreeItemType.Collection"
          class="text-xs font-medium text-muted-foreground"
        >
          {{ item.value.children.length }}
        </span>
        <span
          v-if="item.value.type === DSTreeItemType.Column"
          class="font-normal text-muted-foreground truncate"
        >
          {{ item.value.dataType }}
        </span>
        <span
          v-if="item.value.type === DSTreeItemType.Database"
          class="font-normal text-muted-foreground truncate"
        >
          {{ item.value.path }}
        </span>
      </span>
      <span
        v-if="'description' in item.value && item.value.description"
        class="ml-7 font-normal text-muted-foreground truncate"
      >
        {{ item.value.description }}
      </span>
    </TreeItem>
  </TreeRoot>
</template>

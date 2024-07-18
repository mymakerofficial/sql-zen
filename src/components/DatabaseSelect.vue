<script setup lang="ts">
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from '@/components/ui/select'
</script>

<template>
  <Select model-value="postgresql">
    <SelectTrigger class="bg-transparent border-transparent">
      <SelectValue placeholder="Select database..." />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectItem value="postgresql">
          <div class="flex">
            <img src="@/assets/icons/postgresql.svg" alt="PostgreSQL" class="size-6 mr-2" />
            <span>PostgreSQL</span>
          </div>
        </SelectItem>
        <SelectItem value="sqlite" class="flex">
          <div class="flex">
            <img src="@/assets/icons/sqlite.svg" alt="SQLite" class="size-6 mr-2" />
            <span>SQLite</span>
          </div>
        </SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>


<script setup lang="ts">
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from '@/components/ui/select'
</script>

<template>
  <Select>
    <SelectTrigger>
      <SelectValue placeholder="Select database..." />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectItem value="postgresql">
          PostgreSQL
        </SelectItem>
        <SelectItem value="sqlite">
          SQLite
        </SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>


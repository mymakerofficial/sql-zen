<script setup lang="ts">
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const model = defineModel<string>({ default: 'postgresql' })
</script>

<template>
  <Select v-model="model">
    <SelectTrigger class="w-fit bg-transparent border-transparent [&_[data-description]]:hidden">
      <SelectValue placeholder="Select database..." class="pr-3" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectItem value="postgresql" class="px-3">
          <div class="my-1 flex flex-col gap-2 max-w-80">
            <div class="flex items-center gap-2">
              <img src="@/assets/icons/postgresql.svg" alt="PostgreSQL" class="size-6" />
              <span>PostgreSQL</span>
            </div>
            <p class="pl-8 pr-2 text-xs text-muted-foreground" data-description>PostgreSQL is a versatile database offering advanced features like JSON support, full-text search, and powerful analytics capabilities.</p>
          </div>
        </SelectItem>
        <SelectItem value="sqlite" class="px-3">
          <div class="my-1 flex flex-col gap-2 max-w-80">
            <div class="flex items-center gap-2">
              <img src="@/assets/icons/sqlite.svg" alt="SQLite" class="size-6" />
              <span>SQLite</span>
            </div>
            <p class="pl-8 pr-2 text-xs text-muted-foreground" data-description>SQLite is a lightweight, embedded database ideal for small-scale applications, offering simplicity, speed, and zero configuration.</p>
          </div>
        </SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>


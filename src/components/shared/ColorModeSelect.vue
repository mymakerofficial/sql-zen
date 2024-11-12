<script setup lang="ts">
import { useColorMode } from '@vueuse/core'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'
import { SelectTrigger } from 'radix-vue'
import { SunMoonIcon, SunIcon, MoonIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

const mode = useColorMode()
</script>

<template>
  <Select v-model="mode">
    <SelectTrigger class="[&_[data-description]]:hidden" hide-chevron>
      <Button size="icon" variant="ghost">
        <SelectValue />
      </Button>
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectItem value="system">
          <div class="flex items-center gap-3">
            <SunMoonIcon class="size-4" />
            <span data-description>System</span>
          </div>
        </SelectItem>
        <SelectItem value="dark">
          <div class="flex items-center gap-3">
            <MoonIcon class="size-4" />
            <span data-description>Dark</span>
          </div>
        </SelectItem>
        <SelectItem value="light">
          <div class="flex items-center gap-3">
            <SunIcon class="size-4" />
            <span data-description>Light</span>
          </div>
        </SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>

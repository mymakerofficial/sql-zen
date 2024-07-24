<script setup lang="ts">
import { useColorMode } from '@vueuse/core'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SunMoonIcon, SunIcon, MoonIcon } from 'lucide-vue-next'

const mode = useColorMode()
</script>

<template>
  <Select v-model="mode">
    <SelectTrigger
      class="w-fit bg-transparent border-transparent [&_[data-description]]:hidden"
      hide-chevron
    >
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectItem value="system">
          <div class="flex items-center gap-3">
            <SunMoonIcon class="size-4 min-w-max" />
            <span data-description>System</span>
          </div>
        </SelectItem>
        <SelectItem value="dark">
          <div class="flex items-center gap-3">
            <MoonIcon class="size-4 min-w-max" />
            <span data-description>Dark</span>
          </div>
        </SelectItem>
        <SelectItem value="light">
          <div class="flex items-center gap-3">
            <SunIcon class="size-4 min-w-max" />
            <span data-description>Light</span>
          </div>
        </SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>

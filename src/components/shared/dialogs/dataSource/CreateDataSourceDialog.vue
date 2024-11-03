<script setup lang="ts">
import ResponsiveDialogContent from '@/components/shared/responsiveDialog/ResponsiveDialogContent.vue'
import ResponsiveDialogHeader from '@/components/shared/responsiveDialog/ResponsiveDialogHeader.vue'
import ResponsiveDialogTitle from '@/components/shared/responsiveDialog/ResponsiveDialogTitle.vue'
import ResponsiveDialogDescription from '@/components/shared/responsiveDialog/ResponsiveDialogDescription.vue'
import ResponsiveDialog from '@/components/shared/responsiveDialog/ResponsiveDialog.vue'
import { useDialogContext } from '@/composables/useDialog'
import ResponsiveDialogBody from '@/components/shared/responsiveDialog/ResponsiveDialogBody.vue'
import { selectableDatabaseEngines } from '@/lib/engines/constants'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { ref } from 'vue'

const { open } = useDialogContext()

const modelValue = ref()
const selected = ref()

function handleFocusInput() {
  document
    .querySelector<HTMLInputElement>('[cmdk-input-wrapper] input')
    ?.focus()
}
</script>

<template>
  <ResponsiveDialog v-model:open="open">
    <ResponsiveDialogContent>
      <ResponsiveDialogHeader>
        <ResponsiveDialogTitle>Create new Data Source</ResponsiveDialogTitle>
        <ResponsiveDialogDescription>
          Add a new database connection to your workspace.
        </ResponsiveDialogDescription>
      </ResponsiveDialogHeader>
      <ResponsiveDialogBody class="flex flex-col gap-2">
        <Command v-model="modelValue" v-model:selected-value="selected">
          <CommandInput placeholder="Select DBMS" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                v-for="item in selectableDatabaseEngines"
                :value="item.engine"
                :key="item.engine"
                as-child
              >
                <button
                  tabindex=""
                  @focusin="selected = item.engine"
                  @keydown.up.prevent="handleFocusInput"
                  @keydown.down.prevent="handleFocusInput"
                  class="flex flex-row gap-4 px-4 py-6 cursor-pointer"
                >
                  <img
                    :src="item.icon"
                    :alt="`${item.name} Icon`"
                    class="size-6 mb-auto mt-1"
                  />
                  <span class="space-y-1 text-start">
                    <span class="block font-medium">{{ item.name }}</span>
                    <span
                      class="block text-xs text-muted-foreground"
                      data-description
                    >
                      {{ item.description }}
                    </span>
                  </span>
                </button>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </ResponsiveDialogBody>
      <!--      <ResponsiveDialogFooter>-->
      <!--        <Button variant="ghost">Cancel</Button>-->
      <!--        <Button type="submit">Create</Button>-->
      <!--      </ResponsiveDialogFooter>-->
    </ResponsiveDialogContent>
  </ResponsiveDialog>
</template>

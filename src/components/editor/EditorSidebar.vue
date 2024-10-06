<script setup lang="ts">
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import LogoButton from '@/components/shared/appHeader/LogoButton.vue'
import { useDialog } from '@/composables/useDialog'
import CreateDataSourceDialog from '@/components/shared/dialogs/CreateDataSourceDialog.vue'
import { Button } from '@/components/ui/button'
import DatabaseExplorerContent from '@/components/databaseExplorer/DatabaseExplorerContent.vue'
import { useEnv } from '@/composables/useEnv'
import { cn } from '@/lib/utils'
import AppLogo from '@/components/shared/appHeader/AppLogo.vue'
import { PlusIcon } from 'lucide-vue-next'

const { isMacOS, isTauri } = useEnv()
const { open: openCreate } = useDialog(CreateDataSourceDialog)
</script>

<template>
  <Sheet>
    <SheetTrigger><slot /></SheetTrigger>
    <SheetContent side="left" class="h-full flex flex-col">
      <SheetHeader v-if="!isMacOS" class="text-left">
        <SheetTitle>
          <LogoButton v-if="!isTauri" />
          <AppLogo v-else class="ml-3" />
        </SheetTitle>
      </SheetHeader>
      <div
        :class="
          cn('-mx-6 -mb-6 px-6 py-3 overflow-y-auto', isMacOS ? 'pt-7' : '')
        "
      >
        <div class="h-min flex flex-col gap-4">
          <Button @click="openCreate" variant="secondary" class="gap-2">
            <PlusIcon class="size-4 min-h-max" />
            <span>Add Data Source</span>
          </Button>
          <DatabaseExplorerContent class="pl-3 w-full h-min" />
        </div>
      </div>
    </SheetContent>
  </Sheet>
</template>

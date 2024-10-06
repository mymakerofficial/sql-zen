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

const { isTauri } = useEnv()
const { open: openCreate } = useDialog(CreateDataSourceDialog)
</script>

<template>
  <Sheet>
    <SheetTrigger><slot /></SheetTrigger>
    <SheetContent side="left" class="h-full flex flex-col">
      <SheetHeader v-if="!isTauri" class="text-left">
        <SheetTitle><LogoButton /></SheetTitle>
      </SheetHeader>
      <div :class="cn('-mx-6 -mb-6 px-6 py-3 overflow-y-auto', isTauri ? 'pt-6' : '')">
        <div class="h-min flex flex-col gap-4">
          <Button @click="openCreate"> Add Data Source </Button>
          <DatabaseExplorerContent class="pl-3 w-full h-min" />
        </div>
      </div>
    </SheetContent>
  </Sheet>
</template>

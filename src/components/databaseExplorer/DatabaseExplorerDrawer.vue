<script setup lang="ts">
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import DatabaseExplorerContent from '@/components/databaseExplorer/DatabaseExplorerContent.vue'
import { Button } from '@/components/ui/button'
import { DialogTrigger } from '@/components/ui/dialog'
import { MenuIcon, PlusIcon } from 'lucide-vue-next'
import { useDialog } from '@/composables/useDialog'
import CreateDataSourceDialog from '@/components/shared/dialogs/CreateDataSourceDialog.vue'

const selected = defineModel<string | null>('selected', {
  required: true,
  default: null,
})

const { open: openCreate } = useDialog(CreateDataSourceDialog)
</script>

<template>
  <Drawer>
    <DialogTrigger>
      <Button size="sm" variant="ghost">
        <MenuIcon class="size-4 min-w-max" />
      </Button>
    </DialogTrigger>
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>Data Sources</DrawerTitle>
        <DrawerDescription
          >Select a data source from the list below to open it in
          console.</DrawerDescription
        >
      </DrawerHeader>
      <DatabaseExplorerContent v-model:selected="selected" class="max-h-96" />
      <DrawerFooter>
        <Button @click="openCreate"> Add Data Source </Button>
      </DrawerFooter>
    </DrawerContent>
  </Drawer>
</template>

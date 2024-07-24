<script setup lang="ts">
import BaseDialog from '@/components/shared/dialog/BaseDialog.vue'
import { useDialogContext } from '@/composables/useDialog'
import { DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { DatabaseEngine } from '@/lib/databaseEngines'
import { computed, ref } from 'vue'
import DatabaseEngineModeSelect from '@/components/shared/DatabaseEngineModeSelect.vue'
import { DatabaseEngineMode } from '@/lib/databases/database'
import { useRegistry } from '@/composables/useRegistry'
import { useMutation } from '@tanstack/vue-query'
import type { DataSourceInfo } from '@/lib/databases/dataSourceFactory'
import DatabaseEngineSelect from '@/components/shared/databaseEngineSelect/DatabaseEngineSelect.vue'

const props = defineProps<{
  engine: DatabaseEngine
}>()

const { close, open } = useDialogContext()
const registry = useRegistry()

const engine = ref<DatabaseEngine>(props.engine)
const identifier = ref<string>('identifier')
const mode = ref<DatabaseEngineMode>(DatabaseEngineMode.Memory)

const diableMode = computed(() => {
  return engine.value === DatabaseEngine.DuckDB
})

const disableIdentifier = computed(() => {
  return (
    engine.value === DatabaseEngine.DuckDB ||
    (engine.value === DatabaseEngine.SQLite &&
      mode.value === DatabaseEngineMode.BrowserPersisted)
  )
})

const { mutate: create, error } = useMutation({
  mutationFn: () => {
    const info: DataSourceInfo = {
      engine: engine.value,
      mode: mode.value,
      identifier: identifier.value,
    }

    if (info.engine === DatabaseEngine.DuckDB) {
      info.identifier = null
    }

    if (
      info.engine === DatabaseEngine.SQLite &&
      info.mode === DatabaseEngineMode.BrowserPersisted
    ) {
      info.identifier = null
    }

    registry.register(info)
    return Promise.resolve()
  },
  onSuccess: close,
})
</script>

<template>
  <BaseDialog
    v-model:open="open"
    title="Create new Data Source."
    description="Different databases may support different configurations."
  >
    <div class="grid gap-4 py-4">
      <div class="grid grid-cols-4 items-center gap-4">
        <Label for="engine" class="text-right">Engine</Label>
        <DatabaseEngineSelect v-model="engine" id="engine" class="col-span-3" />
      </div>
      <div class="grid grid-cols-4 items-center gap-4">
        <Label for="mode" class="text-right">Storage Mode</Label>
        <DatabaseEngineModeSelect
          v-model="mode"
          :disabled="diableMode"
          id="mode"
          class="col-span-3"
        />
        <p
          v-if="diableMode"
          class="col-span-full text-sm text-muted-foreground"
        >
          This database engine only supports in memory storage.
        </p>
      </div>
      <div class="grid grid-cols-4 items-center gap-4">
        <Label for="identifier" class="text-right">Identifier</Label>
        <Input
          v-model="identifier"
          :disabled="disableIdentifier"
          id="identifier"
          class="col-span-3"
        />
        <p
          v-if="disableIdentifier"
          class="col-span-full text-sm text-muted-foreground"
        >
          Only one database can be crate with this configuration.
        </p>
      </div>
    </div>
    <div v-if="error" class="text-red-500 text-sm mt-2">
      {{ error.message }}
    </div>
    <DialogFooter>
      <Button @click="create" type="submit">Create</Button>
    </DialogFooter>
  </BaseDialog>
</template>

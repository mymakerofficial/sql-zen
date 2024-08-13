<script setup lang="ts">
import { provideTabManager } from '@/composables/tabs/useTabManager'
import TabView from '@/components/shared/tabs/TabView.vue'
import { ConsoleTabManager } from '@/lib/tabs/manager/consoleTabManager'

const props = withDefaults(
  defineProps<{
    dataSourceKey: string
    showResults?: boolean
  }>(),
  {
    showResults: true,
  },
)

provideTabManager(new ConsoleTabManager(props.dataSourceKey))
</script>

<template>
  <TabView />
  <!--  <Tabs v-model="selected" class="h-full flex flex-col">-->
  <!--    <TabsList class="w-full border-b overflow-x-auto">-->
  <!--      <TabsTrigger value="log" class="gap-2">-->
  <!--        <SquareTerminalIcon class="size-4 min-h-max" />-->
  <!--        <span>Output</span>-->
  <!--      </TabsTrigger>-->
  <!--      <TabsTrigger-->
  <!--        v-for="trigger in triggers"-->
  <!--        :value="trigger.value"-->
  <!--        :key="trigger.value"-->
  <!--        class="gap-2"-->
  <!--      >-->
  <!--        <TableIcon class="size-4 min-h-max" />-->
  <!--        <span>{{ trigger.label }}</span>-->
  <!--      </TabsTrigger>-->
  <!--    </TabsList>-->
  <!--    <TabsContent value="log" class="flex-1 overflow-y-auto">-->
  <!--      <LoggerPanel :logger="dataSource.logger" />-->
  <!--    </TabsContent>-->
  <!--    <TabsContent-->
  <!--      v-for="content in contents"-->
  <!--      :value="content.value"-->
  <!--      :key="content.value"-->
  <!--      class="flex-1 overflow-y-auto"-->
  <!--    >-->
  <!--      <QueryDisplay :query="content.data" />-->
  <!--    </TabsContent>-->
  <!--  </Tabs>-->
</template>

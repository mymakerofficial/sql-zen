<template>
  <div
    class="border rounded-md flex flex-col h-96 flex-grow md:w-fit md:max-w-[40rem]"
  >
    <div class="flex-1 relative overflow-hidden border-b">
      <slot name="panel" />
    </div>
    <div class="p-6 flex flex-col gap-3">
      <slot name="description" />
    </div>
  </div>
</template>

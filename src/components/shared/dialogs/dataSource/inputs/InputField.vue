<script setup lang="ts">
import { Input } from '@/components/ui/input'
import { useFormContext } from 'vee-validate'

const props = defineProps<{
  name: string
}>()

const { defineField } = useFormContext()
const [value, attrs] = defineField(props.name)
</script>

<template>
  <Input v-model="value" v-bind="attrs" :id="name" />
</template>

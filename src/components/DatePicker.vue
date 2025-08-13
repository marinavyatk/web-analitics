<template>
  <VueDatePicker
    :model-value="modelValue"
    :max-date="new Date()"
    :enable-time-picker="false"
    auto-apply
    week-start="1"
    locale="ru"
    :format="format"
    placeholder="Выберите дату"
    @update:model-value="handleDateChange"
  />
</template>
<script setup lang="ts">
import { format } from '@/utils/utils.ts'

interface Props {
  modelValue: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const handleDateChange = (date: Date) => {
  if (date) {
    const formattedDate = format(date)
    emit('update:modelValue', formattedDate)
  }
}
</script>

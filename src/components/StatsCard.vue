<script setup lang="ts">
import Card from '@/components/CardTemplate.vue'
import type { Stat } from '@/types.ts'

defineProps<{
  stats: Stat[]
}>()
</script>

<template>
  <Card>
    <div class="flex flex-col justify-between gap-1 min-w-auto lg:min-w-80">
      <div v-for="(field, index) in stats" :key="field.label">
        <div class="text-gray-500 text-sm">{{ field.label ? field.label : '0.0' }}</div>
        <div
          class="text-3xl font-bold text-indigo-800 pb-2"
          :class="{
            'border-b border-gray-200': index < stats.length - 1,
          }"
        >
          {{ field.text ? field.text : 0.0 }}
        </div>
      </div>
    </div>
  </Card>
</template>

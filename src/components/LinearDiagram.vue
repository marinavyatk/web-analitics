<script setup lang="ts">
import { computed, type PropType } from 'vue'
import { chartOptionsLinear } from '@/utils/diagram-options.ts'

const props = defineProps({
  title: String,
  series: {
    type: Array as PropType<{ name: string; data: (number | { x: string; y: number })[] }[]>,
    required: true,
  },
})

const options = computed(() => {
  return {
    ...chartOptionsLinear,
    title: {
      ...chartOptionsLinear.title,
      text: props.title,
    },
  }
})
</script>

<template>
  <apex-chart width="100%" height="350" :options="options" :series="props.series" />
</template>

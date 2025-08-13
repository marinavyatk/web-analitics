<script setup lang="ts">
import { ref, watch } from 'vue'
import type { ApexOptions } from 'apexcharts'
import { donutColors } from '@/utils/diagram-options.ts'

const props = defineProps<{
  series: number[]
  labels?: string[]
}>()

const chartOptions = ref<ApexOptions>({
  labels: props.labels ?? [],
  chart: {
    type: 'donut',
    height: 500,
  },
  colors: donutColors,
  responsive: [
    {
      breakpoint: 1420,
      options: {
        legend: {
          position: 'bottom',
        },
      },
    },
  ],
})

watch(
  () => props.labels,
  (newLabels) => {
    chartOptions.value = {
      ...chartOptions.value,
      labels: newLabels ?? [],
    }
  },
  { immediate: true },
)
</script>

<template>
  <apex-chart type="donut" :options="chartOptions" :series="series" width="100%" height="100%" />
</template>

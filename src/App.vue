<script setup lang="ts">
import DashboardHeader from '@/components/DashboardHeader.vue'
</script>

<template>
  <div class="bg-white m-2 lg:m-12 p-3 lg:p-10 rounded-4xl">
    <dashboard-header />
    <RouterView />
  </div>
</template>

<style>
body {
  --vs-controls-color: #959595;
  --vs-border-color: #d1d5db;
  --easy-table-border: none;
}

.pagination__items-index {
  display: none;
}

td {
  white-space: nowrap;
}
</style>

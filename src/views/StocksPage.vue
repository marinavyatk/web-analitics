<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import type { Stock } from '@/types.ts'
import { api } from '@/api.ts'
import { useRoute, useRouter } from 'vue-router'
import Card from '@/components/CardTemplate.vue'
import type { ServerOptions } from 'vue3-easy-data-table'
import { getCurrentMonthDates, perPage } from '@/utils/utils.ts'
import { theadStocks } from '@/utils/theads.ts'
import { chartOptionsColumn } from '@/utils/diagram-options.ts'
import { getRowStocks } from '@/utils/rows.ts'

const data = ref<Stock[]>([])
const filteredData = ref<Stock[]>([])
const route = useRoute()
const router = useRouter()

const series = ref([
  {
    name: 'Остаток',
    data: [] as { x: string; y: number }[],
  },
])

const rows = computed(() => filteredData.value.map((item) => getRowStocks(item)))
const defaultDates = getCurrentMonthDates()
const dateFrom = ref(defaultDates.start)
const dateTo = ref(defaultDates.end)
const total = ref(0)
const tableKey = ref(0)
const warehouseOptions = ref<string[]>([])
const selectedWarehouse = ref('Все склады')

const getUniqueWarehouses = () => {
  const uniqueWarehouses = Array.from(new Set(data.value.map((el) => el.warehouse_name))).sort()
  warehouseOptions.value = ['Все склады', ...uniqueWarehouses]
}
const applyClientFilters = () => {
  let filtered = [...data.value]

  if (selectedWarehouse.value !== 'Все склады') {
    filtered = filtered.filter((item) => item.warehouse_name === selectedWarehouse.value)
  }

  filteredData.value = filtered
}

const prepareDiagramData = () => {
  const grouped: Record<string, number> = {}
  filteredData.value.forEach((el) => {
    grouped[el.warehouse_name] = (grouped[el.warehouse_name] || 0) + Number(el.quantity_full)
  })
  series.value[0].data = Object.entries(grouped).map(([x, y]) => ({
    x,
    y: y ? Number(y.toFixed(0)) : 0,
  }))
}

const fetchData = async () => {
  const queryParams = {
    dateFrom: dateFrom.value,
    dateTo: dateTo.value,
    page: serverOptions.value.page,
  }

  const response = await api.getStocks(queryParams)
  data.value = response.data
  total.value = response.meta.total
  applyClientFilters()
}

const handleFilterSubmit = async (event: Event) => {
  event.preventDefault()

  const newQuery = {
    dateFrom: dateFrom.value,
    dateTo: dateTo.value,
    page: '1',
  }

  await router.replace({ query: newQuery })
  serverOptions.value.page = 1
  await fetchData()
  prepareDiagramData()
  getUniqueWarehouses()
  tableKey.value++
}

const serverOptions = ref<ServerOptions>({
  page: Number(route.query.page) || 1,
  rowsPerPage: perPage,
})

const initializeFiltersFromURL = async () => {
  if (!route.query.dateFrom || !route.query.dateTo) {
    const defaultDates = getCurrentMonthDates()
    dateFrom.value = defaultDates.start
    dateTo.value = defaultDates.end

    await router.replace({
      query: {
        ...route.query,
        dateFrom: defaultDates.start,
        dateTo: defaultDates.end,
      },
    })
  } else {
    dateFrom.value = route.query.dateFrom as string
    dateTo.value = route.query.dateTo as string
  }
  if (route.query.warehouse) selectedWarehouse.value = route.query.warehouse as string
}

watch(
  () => serverOptions.value.page,
  async (newPage, oldPage) => {
    if (newPage !== oldPage) {
      router.replace({
        query: {
          ...route.query,
          page: String(newPage),
        },
      })
      await fetchData()
      prepareDiagramData()
      getUniqueWarehouses()
      tableKey.value++
    }
  },
)

const initializeComponent = async () => {
  await initializeFiltersFromURL()
  await fetchData()
  prepareDiagramData()
  getUniqueWarehouses()
}

onMounted(() => {
  initializeComponent()
})
</script>

<template>
  <div class="flex gap-7 items-start mb-7 flex-col lg:flex-row">
    <Card class="flex-grow-2 w-full lg:w-auto">
      <apex-chart width="100%" height="350" :options="chartOptionsColumn" :series="series" />
    </Card>
    <Card class="w-full lg:w-auto">
      <form
        @submit="handleFilterSubmit"
        class="flex flex-col justify-between h-full gap-5 min-w-auto lg:min-w-80"
      >
        <div class="text-indigo-800 text-3xl font-bold">Фильтры</div>
        <div class="text-gray-500 text-sm">*Фильтр применяется к уже загруженным данным</div>
        <div>
          <span class="text-gray-500 text-sm">Склад:</span>
          <v-select
            :options="warehouseOptions"
            label="Склад"
            v-model="selectedWarehouse"
            class="h-[38px]"
          />
        </div>
        <button type="submit" class="bg-indigo-800 w-full text-white rounded-md py-2 text-sm">
          Установить
        </button>
      </form>
    </Card>
  </div>

  <Card>
    <EasyDataTable
      buttons-pagination
      :headers="theadStocks"
      :items="rows"
      :hide-rows-per-page="true"
      :server-items-length="total"
      v-model:server-options="serverOptions"
      themeColor="#3730a3"
      :key="tableKey"
    />
  </Card>
</template>

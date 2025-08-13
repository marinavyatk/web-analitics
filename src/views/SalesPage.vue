<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import type { Sale } from '@/types.ts'
import { api } from '@/api.ts'
import { useRoute, useRouter } from 'vue-router'
import Card from '@/components/CardTemplate.vue'
import type { ServerOptions } from 'vue3-easy-data-table'
import { getCurrentMonthDates, perPage } from '@/utils/utils.ts'
import LinearDiagram from '@/components/LinearDiagram.vue'
import StatsCard from '@/components/StatsCard.vue'
import DonutDiagram from '@/components/DonutDiagram.vue'
import DatePicker from '@/components/DatePicker.vue'
import { theadSales } from '@/utils/theads.ts'
import { getRowSales } from '@/utils/rows.ts'

const data = ref<Sale[]>([])
const filteredData = ref<Sale[]>([])
const route = useRoute()
const router = useRouter()

const periodProfit = ref('')
const averageSale = ref('')
const returnPercent = ref('')

const series = ref([
  {
    name: 'Выручка',
    data: [] as { x: string; y: number }[],
  },
])

const stats = computed(() => [
  { label: 'Выручка', text: `${periodProfit.value}₽` },
  { label: 'Средний чек', text: `${averageSale.value}₽` },
  { label: 'Процент возвратов', text: `${returnPercent.value}%` },
])

const donutSeries = ref<number[]>([])
const labels = ref<string[]>([])
const rows = computed(() => filteredData.value.map((item) => getRowSales(item)))
const defaultDates = getCurrentMonthDates()
const dateFrom = ref(defaultDates.start)
const dateTo = ref(defaultDates.end)
const countryOptions = ref<string[]>([])
const selectedCountry = ref('Все страны')
const warehouseOptions = ref<string[]>([])
const selectedWarehouse = ref('Все склады')
const refundOptions = ['Все позиции', 'Только с возвратом', 'Только без возврата']
const selectedRefund = ref('Все позиции')
const total = ref(0)
const tableKey = ref(0)

const applyClientFilters = () => {
  let filtered = [...data.value]

  if (selectedCountry.value !== 'Все страны') {
    filtered = filtered.filter((item) => item.country_name === selectedCountry.value)
  }

  if (selectedWarehouse.value !== 'Все склады') {
    filtered = filtered.filter((item) => item.warehouse_name === selectedWarehouse.value)
  }

  if (selectedRefund.value === 'Только с возвратом') {
    filtered = filtered.filter((item) => item.is_storno === true)
  } else if (selectedRefund.value === 'Только без возврата') {
    filtered = filtered.filter((item) => item.is_storno === false)
  }

  filteredData.value = filtered
}

const calculateStats = () => {
  const payments = filteredData.value.map((el) => Number(el.for_pay))
  periodProfit.value = payments.reduce((a, b) => a + b, 0).toFixed(1)
  averageSale.value = (Number(periodProfit.value) / payments.length).toFixed(1)
  const returns = filteredData.value.map((el) => el.is_storno)
  returnPercent.value = ((returns.filter((el) => el).length / returns.length) * 100).toFixed(1)
}

const prepareProfitData = () => {
  const grouped: Record<string, number> = {}
  filteredData.value.forEach((el) => {
    grouped[el.date] = (grouped[el.date] || 0) + Number(el.for_pay)
  })
  series.value[0].data = Object.entries(grouped)
    .map(([x, y]) => ({ x, y: y ? Number(y.toFixed(0)) : 0 }))
    .sort((a, b) => new Date(a.x).getTime() - new Date(b.x).getTime())
}

const prepareWarehouseData = () => {
  const warehousesGrouped: Record<string, number> = {}
  const warehouses = new Set(filteredData.value.map((el) => el.warehouse_name))
  warehouses.forEach((warehouse) => {
    warehousesGrouped[warehouse] = filteredData.value.filter(
      (el) => el.warehouse_name === warehouse,
    ).length
  })
  donutSeries.value = Object.values(warehousesGrouped)
  labels.value = Object.keys(warehousesGrouped)
}

const fetchData = async () => {
  const queryParams = {
    dateFrom: dateFrom.value,
    dateTo: dateTo.value,
    page: serverOptions.value.page,
  }

  const response = await api.getSales(queryParams)
  data.value = response.data
  total.value = response.meta.total
}

const getUniqueCountries = () => {
  const uniqueCountries = Array.from(new Set(data.value.map((el) => el.country_name))).sort()
  countryOptions.value = ['Все страны', ...uniqueCountries]
}

const getUniqueWarehouses = () => {
  const uniqueWarehouses = Array.from(new Set(data.value.map((el) => el.warehouse_name))).sort()
  warehouseOptions.value = ['Все склады', ...uniqueWarehouses]
}

const updateData = async () => {
  await fetchData()
  applyClientFilters()
  calculateStats()
  prepareProfitData()
  prepareWarehouseData()
  getUniqueCountries()
  getUniqueWarehouses()
}

const handleFilterSubmit = async (event: Event) => {
  event.preventDefault()

  const newQuery = {
    ...route.query,
    dateFrom: dateFrom.value,
    dateTo: dateTo.value,
    country: selectedCountry.value !== 'Все страны' ? selectedCountry.value : undefined,
    warehouse: selectedWarehouse.value !== 'Все склады' ? selectedWarehouse.value : undefined,
    refund: selectedRefund.value !== 'Все позиции' ? selectedRefund.value : undefined,
    page: '1',
  }

  Object.keys(newQuery).forEach((key) => {
    if (newQuery[key as keyof typeof newQuery] === undefined) {
      delete newQuery[key as keyof typeof newQuery]
    }
  })

  await router.replace({ query: newQuery })
  serverOptions.value.page = 1
  await updateData()
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

  if (route.query.country) selectedCountry.value = route.query.country as string
  if (route.query.warehouse) selectedWarehouse.value = route.query.warehouse as string
  if (route.query.refund) selectedRefund.value = route.query.refund as string
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
      await updateData()
      tableKey.value++
    }
  },
)

onMounted(async () => {
  await initializeFiltersFromURL()
  await updateData()
})
</script>

<template>
  <div class="flex gap-7 items-start mb-7 flex-col lg:flex-row">
    <Card class="flex-grow-2 w-full lg:w-auto">
      <LinearDiagram :series="series" title="Выручка" />
    </Card>
    <StatsCard :stats="stats" class="w-full lg:w-auto" />
  </div>
  <div class="flex gap-7 mb-7 text-lg flex-col lg:flex-row">
    <Card class="min-w-auto lg:min-w-100">
      <form @submit="handleFilterSubmit" class="flex flex-col justify-between h-full gap-2">
        <div class="text-indigo-800 text-3xl font-bold">Фильтры</div>
        <div>
          <span class="text-gray-500 text-sm">Дата начала:</span>
          <DatePicker v-model="dateFrom" />
        </div>
        <div>
          <span class="text-gray-500 text-sm">Дата конца:</span>
          <DatePicker v-model="dateTo" />
        </div>
        <div>
          <div class="text-gray-500 text-sm">
            *Фильтры по стране, складу и возвратам применяются к уже загруженным данным
          </div>
          <span class="text-gray-500 text-sm">Страна:</span>
          <v-select
            :options="countryOptions"
            label="Страна"
            v-model="selectedCountry"
            class="h-[38px]"
          />
        </div>
        <div>
          <span class="text-gray-500 text-sm">Склад:</span>
          <v-select
            :options="warehouseOptions"
            label="Склад"
            v-model="selectedWarehouse"
            class="h-[38px]"
          />
        </div>
        <div>
          <span class="text-gray-500 text-sm">Возврат:</span>
          <v-select
            :options="refundOptions"
            label="Возврат"
            v-model="selectedRefund"
            class="h-[38px]"
          />
        </div>
        <button type="submit" class="bg-indigo-800 w-full text-white rounded-md py-2 text-sm">
          Установить
        </button>
      </form>
    </Card>
    <Card class="flex-grow-1 min-h-40">
      <div class="text-indigo-800 text-3xl font-bold text-right">Распределение по складам</div>
      <DonutDiagram :series="donutSeries" :labels="labels" />
    </Card>
  </div>
  <Card>
    <EasyDataTable
      buttons-pagination
      :headers="theadSales"
      :items="rows"
      :hide-rows-per-page="true"
      :server-items-length="total"
      v-model:server-options="serverOptions"
      themeColor="#3730a3"
      :key="tableKey"
    />
  </Card>
</template>

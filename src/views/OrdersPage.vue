<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import type { Order } from '@/types.ts'
import { api } from '@/api.ts'
import { useRoute, useRouter } from 'vue-router'
import Card from '@/components/CardTemplate.vue'
import type { ServerOptions } from 'vue3-easy-data-table'
import { getCurrentMonthDates, perPage } from '@/utils/utils.ts'
import LinearDiagram from '@/components/LinearDiagram.vue'
import DatePicker from '@/components/DatePicker.vue'
import { theadOrders } from '@/utils/theads.ts'
import { getRowOrders } from '@/utils/rows.ts'

const data = ref<Order[]>([])
const route = useRoute()
const router = useRouter()

const series = ref([
  {
    name: 'Выручка',
    data: [] as { x: string; y: number }[],
  },
])

const rows = computed(() => data.value.map((item) => getRowOrders(item)))

const defaultDates = getCurrentMonthDates()
const dateFrom = ref(defaultDates.start)
const dateTo = ref(defaultDates.end)
const total = ref(0)
const tableKey = ref(0)

const prepareDiagramData = () => {
  const grouped: Record<string, number> = {}
  data.value.forEach((el) => {
    const date = el.date.split(' ')[0]
    grouped[date] = (grouped[date] || 0) + Number(el.total_price)
  })
  series.value[0].data = Object.entries(grouped)
    .map(([x, y]) => ({ x, y: y ? Number(y.toFixed(0)) : 0 }))
    .sort((a, b) => new Date(a.x).getTime() - new Date(b.x).getTime())
}

const fetchData = async () => {
  const queryParams = {
    dateFrom: dateFrom.value,
    dateTo: dateTo.value,
    page: serverOptions.value.page,
  }

  const response = await api.getOrders(queryParams)
  data.value = response.data
  total.value = response.meta.total
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

      tableKey.value++
    }
  },
)

onMounted(async () => {
  await initializeFiltersFromURL()
  await fetchData()
  prepareDiagramData()
})
</script>

<template>
  <div class="flex gap-7 items-start mb-7 flex-col lg:flex-row">
    <Card class="flex-grow-2 w-full lg:w-auto">
      <LinearDiagram :series="series" title="Выручка" />
    </Card>
    <Card class="w-full lg:w-auto">
      <form
        @submit="handleFilterSubmit"
        class="flex flex-col justify-between h-full gap-5 min-w-auto lg:min-w-80"
      >
        <div class="text-indigo-800 text-3xl font-bold">Фильтры</div>
        <div>
          <span class="text-gray-500 text-sm">Дата начала:</span>
          <DatePicker v-model="dateFrom" />
        </div>
        <div>
          <span class="text-gray-500 text-sm">Дата конца:</span>
          <DatePicker v-model="dateTo" />
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
      :headers="theadOrders"
      :items="rows"
      :hide-rows-per-page="true"
      :server-items-length="total"
      v-model:server-options="serverOptions"
      themeColor="#3730a3"
      :key="tableKey"
    />
  </Card>
</template>

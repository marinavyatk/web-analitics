import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/HomePage.vue'
import Orders from '@/views/OrdersPage.vue'
import Sales from '@/views/SalesPage.vue'
import Stocks from '@/views/StocksPage.vue'
import Incomes from '@/views/IncomesPage.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/incomes', component: Incomes },
  { path: '/orders', component: Orders },
  { path: '/sales', component: Sales },
  { path: '/stocks', component: Stocks },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router

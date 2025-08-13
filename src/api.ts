import type { Income, Order, Sale, ServerResponse, Stock } from '@/types.ts'
import { format, limit } from '@/utils/utils.ts'

const key = 'E6kUTYrYwZq2tN4QEtyzsbEBk3ie'

function buildUrl(path: string, queryParams: Record<string, string> = {}) {
  const url = new URL(`/api/${path}`, window.location.origin)

  url.searchParams.set('key', key)
  url.searchParams.set('limit', String(limit))

  for (const [k, v] of Object.entries(queryParams)) {
    if (v) {
      url.searchParams.set(k, String(v))
    }
  }

  return url.toString()
}

export const api = {
  async getSales(params = {}): Promise<ServerResponse<Sale>> {
    const url = buildUrl('sales', params)
    const response = await fetch(url)
    return await response.json()
  },
  async getOrders(params = {}): Promise<ServerResponse<Order>> {
    const url = buildUrl('orders', params)
    const response = await fetch(url)
    return await response.json()
  },
  async getIncomes(params = {}): Promise<ServerResponse<Income>> {
    const url = buildUrl('incomes', params)
    const response = await fetch(url)
    return await response.json()
  },
  async getStocks(params = {}): Promise<ServerResponse<Stock>> {
    const today = new Date(Date.now())
    const date = format(today)
    const url = buildUrl('stocks', { ...params, dateFrom: date })
    const response = await fetch(url)
    return await response.json()
  },
}

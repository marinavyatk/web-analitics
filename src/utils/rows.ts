import type { Income, Order, Sale, Stock } from '@/types.ts'
import { emptyField } from '@/utils/utils.ts'

export const getRowSales = (item: Sale) => {
  return {
    date: item.date || emptyField,
    article: item.supplier_article || emptyField,
    total_price: Number(item.total_price).toFixed(1) ?? emptyField,
    discount: Number(Number(item.discount_percent).toFixed(1)) ?? emptyField,
    price_with_disc: Number(item.price_with_disc).toFixed(1) ?? emptyField,
    for_pay: Number(item.for_pay).toFixed(1) ?? emptyField,
    warehouse_name: item.warehouse_name || emptyField,
    country_name: item.country_name || emptyField,
    is_storno: item.is_storno ? 'Да' : 'Нет',
  }
}

export const getRowIncomes = (item: Income) => {
  return {
    date: item.date || emptyField,
    article: item.supplier_article || emptyField,
    quantity: item.quantity ?? emptyField,
    total_price: Number(item.total_price).toFixed(1) ?? emptyField,
    warehouse_name: item.warehouse_name || emptyField,
  }
}

export const getRowOrders = (item: Order) => {
  return {
    date: item.date || emptyField,
    article: item.supplier_article || emptyField,
    discount: Number(Number(item.discount_percent).toFixed(1)) ?? emptyField,
    total_price: Number(item.total_price).toFixed(1) ?? emptyField,
    warehouse_name: item.warehouse_name || emptyField,
    is_cancel: item.is_cancel ? 'Да' : 'Нет',
  }
}

export const getRowStocks = (item: Stock) => {
  return {
    article: item.supplier_article || emptyField,
    quantity: item.quantity_full ?? emptyField,
    discount: Number(Number(item.discount).toFixed(1)) ?? emptyField,
    price: Number(item.price).toFixed(1) ?? emptyField,
    warehouse_name: item.warehouse_name || emptyField,
    in_way_to_client: item.in_way_to_client ?? emptyField,
  }
}

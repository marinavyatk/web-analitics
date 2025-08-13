export type Sale = {
  g_number: string
  date: string
  last_change_date: string
  supplier_article: string
  tech_size: string
  barcode: number
  total_price: string
  discount_percent: string
  is_supply: boolean
  is_realization: boolean
  promo_code_discount: string | null
  warehouse_name: string
  country_name: string
  oblast_okrug_name: string
  region_name: string
  income_id: number
  sale_id: string
  odid: string | null
  spp: string
  for_pay: string
  finished_price: string
  price_with_disc: string
  nm_id: number
  subject: string
  category: string
  brand: string
  is_storno: boolean | null
}

export type Stat = {
  label: string
  text: string | number
}

export type Income = {
  income_id: number
  number: string
  date: string
  last_change_date: string
  supplier_article: string
  tech_size: string
  barcode: number
  quantity: number
  total_price: string
  date_close: string
  warehouse_name: string
  nm_id: number
}

export type Order = {
  g_number: string
  date: string
  last_change_date: string
  supplier_article: string
  tech_size: string
  barcode: number
  total_price: string
  discount_percent: number
  warehouse_name: string
  oblast: string
  income_id: number
  odid: string
  nm_id: number
  subject: string
  category: string
  brand: string
  is_cancel: boolean
  cancel_dt: string | null
}

export type Stock = {
  date: string
  last_change_date: string
  supplier_article: string
  tech_size: string
  barcode: number
  quantity: number
  is_supply: boolean
  is_realization: boolean
  quantity_full: number
  warehouse_name: string
  in_way_to_client: number
  in_way_from_client: number
  nm_id: number
  subject: string
  category: string
  brand: string
  sc_code: number
  price: string
  discount: string
}

export type ServerResponse<T> = {
  data: Array<T>
  meta: { total: number }
}

import type { Product } from './product'

export interface Collection {
  id: string
  name: string
  slug: string
  description?: string | null
  season?: string | null
  theme?: string | null
  release_date?: string | null
  end_date?: string | null
  is_active: boolean
  is_featured: boolean
  sort_order: number
  products_count: number
  active_products_count?: number
  total_stock?: number
  cover_image_url?: string | null
  banner_image_url?: string | null
  meta_title?: string | null
  meta_description?: string | null
  products?: Product[]
}

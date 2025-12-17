
export interface Category {
  id: number
  name: string
  description?: string | null
  slug: string
  image?: string
  icon?: string
  parent_id?: number | null
  children?: Category[] // Pour l'arborescence
  products_count?: number
}
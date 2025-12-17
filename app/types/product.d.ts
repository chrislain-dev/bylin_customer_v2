
export interface Product {
  id: number
  name: string
  slug: string
  price: number
  sale_price?: number
  description?: string
  images: string[]
  stock_quantity: number
  colors?: string[]
  sizes?: string[]
  brands?: string[]
  reviews?: Reviews[]
}

export interface Reviews {
    id: string
    user_id: string
    product_id: string
    rating: number
    comment: string
    created_at: string
    updated_at: string
}
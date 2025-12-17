
export interface CartItemOption {
  id: number
  name: string
  value?: string
}

export interface CartItem {
  id: number // Generated ID for UI tracking
  product_id: number
  slug?: string // Product slug for navigation
  name: string
  price: number
  image?: string
  quantity: number
  // Gestion des variantes (Taille, Couleur, etc.)
  selectedColor?: CartItemOption | null
  selectedSize?: CartItemOption | null
  variant_id?: number | null
  variant?: {
    size?: string
    color?: string
  }
}

export interface CouponData {
  code: string
  discount_value: number
  type: 'fixed' | 'percent'
}

export interface DeliveryInfo {
  address_id?: number
  delivery_method?: string
  delivery_cost: number
  set_at: string
}
/**
 * Customer interface
 */
export interface Customer {
  id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  status: 'active' | 'inactive' | 'suspended'
  google_id?: string
  created_at: string
  updated_at: string
  addresses?: Address[]
  email_verified_at?: string | null
  roles?: string[]
  permissions?: string[]
  avatar_url?: string
}

/**
 * Address interface
 */
export interface Address {
  id: string
  customer_id?: string
  type: 'billing' | 'shipping'
  first_name: string
  last_name: string
  address_line_1: string
  address_line_2?: string
  city: string
  state?: string
  postal_code?: string
  country: string
  phone?: string
  is_default: boolean
}

export interface ApiResponse<T> {
  success: boolean
  message?: string
  data: T
}

export interface ValidationErrors {
  [field: string]: string[]
}

// Alias pour compatibilité si nécessaire, mais on préfère Customer
export type User = Customer
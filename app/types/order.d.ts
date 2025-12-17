
export interface Order {
  id: number
  reference: string
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'failed'
  total_amount: number
  created_at: string
  items?: any[]
  // ... autres champs
}

export interface CreateOrderResponse {
  success: boolean
  message?: string
  order?: Order
  redirect_url?: string
  payment_token?: {
    payment_url: string
    url: string
  }
}

import type { CartItem } from '~/types/cart'

export type GiftContributionMode = 'amount' | 'percentage'

export interface GiftCartContributor {
  id: string
  contributor_name: string
  contribution_amount: number
  contribution_percentage: number
  payment_status: string
  message?: string | null
  created_at: string
}

export interface GiftCart {
  id: string
  is_gift_cart: boolean
  gift_cart_token: string
  gift_cart_status: 'pending' | 'partial' | 'completed' | 'expired' | 'cancelled'
  gift_cart_target_amount: number
  gift_cart_paid_amount: number
  gift_cart_message?: string | null
  gift_cart_expires_at?: string | null
  items: CartItem[]
  contributors?: GiftCartContributor[]
  created_at?: string
}

export const useGiftCarts = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase || ''
  const client = useSanctumClient()

  const buildPublicUrl = (token: string) => {
    const siteUrl = config.public.siteUrl || ''
    return `${String(siteUrl).replace(/\/$/, '')}/gift-carts/${token}`
  }

  const createFromCurrentCart = async (payload: { cart_id: string; message?: string; expiration_days?: number }) => {
    return await client<{ success: boolean; data: { gift_cart: GiftCart; share_link: string }; message: string }>(
      '/api/v1/customer/cart/convert-to-gift',
      { method: 'POST', body: payload }
    )
  }

  const fetchGiftCart = async (token: string) => {
    const response = await $fetch<{ success: boolean; data: GiftCart }>(`${apiBase}/api/v1/gift-carts/${token}`)
    return response.data
  }

  const contribute = async (token: string, payload: {
    amount?: number
    contribution_type?: GiftContributionMode
    percentage?: number
    name: string
    email: string
    message?: string
  }) => {
    return await $fetch<{ success: boolean; data: GiftCartContributor; message: string }>(
      `${apiBase}/api/v1/gift-carts/${token}/contribute`,
      { method: 'POST', body: payload }
    )
  }

  const fetchMyGiftCarts = async () => {
    const response = await client<{ data: GiftCart[] }>('/api/v1/customer/gift-carts')
    return response.data || []
  }

  const cancelGiftCart = async (token: string) => {
    return await client(`/api/v1/customer/gift-carts/${token}/cancel`, { method: 'POST' })
  }

  return { buildPublicUrl, createFromCurrentCart, fetchGiftCart, contribute, fetchMyGiftCarts, cancelGiftCart }
}

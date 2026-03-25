import { defineStore } from 'pinia'
import type { Order } from '~/types/order'

export const useOrderStore = defineStore('order', () => {
  const client = useSanctumClient()
  const currentOrder = ref<Order | null>(null)
  
  async function createOrder(payload: any) {
    try {
      console.log('Creating order with payload:', payload)
      const response = await client<{ data: Order, message: string }>('/api/v1/customer/orders', {
        method: 'POST',
        body: payload
      })
      console.log('Order creation response:', response)
      currentOrder.value = response.data
      return response
    } catch (error) {
      console.error('Order creation error:', error)
      throw error
    }
  }

  async function fetchOrders() {
      // TODO: Implement fetch orders logic
  }

  return {
    currentOrder,
    createOrder,
    fetchOrders
  }
})

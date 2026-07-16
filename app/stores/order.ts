import { defineStore } from 'pinia'
import type { Order } from '~/types/order'

export const useOrderStore = defineStore('order', () => {
  const client = useSanctumClient()
  const currentOrder = ref<Order | null>(null)
  const orders = ref<Order[]>([])
  const loading = ref(false)

  async function createOrder(payload: any) {
    const response = await client<{ data: Order, message: string }>('/api/v1/customer/orders', { method: 'POST', body: payload })
    currentOrder.value = response.data
    return response
  }

  async function fetchOrders() {
    loading.value = true
    try {
      interface PaginatedOrders {
        current_page: number;
        data: Order[];
      }

      const response = await client<{ data: PaginatedOrders }>(
        "/api/v1/customer/orders",
      );

      orders.value = response.data.data;
      return orders.value;
      return orders.value
    } finally { loading.value = false }
  }

  async function fetchOrder(id: string) {
    const response = await client<{ data: Order }>(`/api/v1/customer/orders/${id}`)
    currentOrder.value = response.data
    return response.data
  }

  async function cancelOrder(id: string) {
    const response = await client(`/api/v1/customer/orders/${id}/cancel`, { method: 'POST' })
    await fetchOrders()
    return response
  }

  return { currentOrder, orders, loading, createOrder, fetchOrders, fetchOrder, cancelOrder }
})

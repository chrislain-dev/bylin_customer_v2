import { defineStore } from 'pinia'
import type { Address, CheckoutState } from '~/types/order'

export const useCheckoutStore = defineStore('checkout', () => {
  const authStore = useAuthStore()
  
  // State
  const state = ref<CheckoutState>({
    shippingAddress: {
      first_name: authStore.user?.first_name || '',
      last_name: authStore.user?.last_name || '',
      phone: authStore.user?.phone || '',
      email: authStore.user?.email || '',
      address_line1: '',
      city: 'Cotonou',
      country: 'BJ',
    },
    billingAddress: {
      first_name: '',
      last_name: '',
      phone: '',
      address_line1: '',
      city: 'Cotonou',
      country: 'BJ',
    },
    useBillingAsShipping: true,
    paymentMethod: 'fedapay',
    customerPhone: authStore.user?.phone || '',
    customerEmail: authStore.user?.email || '',
    customerNote: ''
  })

  // Actions
  function setShippingAddress(address: Address) {
    state.value.shippingAddress = { ...state.value.shippingAddress, ...address }
    if (state.value.useBillingAsShipping) {
      state.value.billingAddress = { ...state.value.shippingAddress }
    }
  }

  function setPaymentMethod(method: string) {
    state.value.paymentMethod = method
  }

  function toggleBillingAddress() {
    state.value.useBillingAsShipping = !state.value.useBillingAsShipping
    if (state.value.useBillingAsShipping) {
      state.value.billingAddress = { ...state.value.shippingAddress }
    }
  }

  function validateShippingStep(): boolean {
    const { first_name, last_name, phone, address_line1, city } = state.value.shippingAddress
    return !!(first_name && last_name && phone && address_line1 && city)
  }

  return {
    state,
    setShippingAddress,
    setPaymentMethod,
    toggleBillingAddress,
    validateShippingStep
  }
}, {
  persist: true
})

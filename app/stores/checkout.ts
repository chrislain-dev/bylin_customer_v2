import { defineStore } from 'pinia'
import type { Address, CheckoutState } from '~/types/order'

export const useCheckoutStore = defineStore('checkout', () => {
  const authStore = useAuthStore()

  const defaultState = (): CheckoutState => ({
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

  // State
  const state = ref<CheckoutState>(defaultState())

  // Cahier des charges §9 : canal de finalisation ('online' | 'whatsapp')
  const channel = ref<'online' | 'whatsapp'>('online')

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

  function setChannel(value: 'online' | 'whatsapp') {
    channel.value = value
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

  // Bug fix : les stores "setup" n'ont pas de $reset() automatique,
  // l'appel checkoutStore.$reset?.() ne faisait donc rien.
  function reset() {
    state.value = defaultState()
    channel.value = 'online'
  }

  return {
    state,
    channel,
    setShippingAddress,
    setPaymentMethod,
    setChannel,
    toggleBillingAddress,
    validateShippingStep,
    reset
  }
}, {
  persist: true
})

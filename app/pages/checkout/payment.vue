<template>
  <div class="min-h-screen bg-[#FAFAFA] py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Stepper -->
      <div class="flex items-center justify-center mb-12">
        <div class="flex items-center">
          <div class="flex flex-col items-center">
            <div class="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold">✓</div>
            <span class="text-sm font-medium mt-2">Livraison</span>
          </div>
          <div class="w-24 h-0.5 bg-black mx-4"></div>
          <div class="flex flex-col items-center">
            <div class="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold">2</div>
            <span class="text-sm font-medium mt-2">Paiement</span>
          </div>
          <div class="w-24 h-0.5 bg-gray-200 mx-4"></div>
          <div class="flex flex-col items-center opacity-50">
            <div class="w-10 h-10 bg-white border-2 border-gray-200 text-gray-400 rounded-full flex items-center justify-center font-bold">3</div>
            <span class="text-sm font-medium mt-2">Confirmation</span>
          </div>
        </div>
      </div>

      <div class="grid lg:grid-cols-3 gap-12">
        <!-- Payment Options -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 class="text-2xl font-bold font-syne mb-6">Moyen de paiement</h2>
            
            <div class="space-y-4">
              <!-- WhatsApp — Cahier des charges §9 : Option 1 -->
              <label class="flex items-start gap-4 p-6 border rounded-xl cursor-pointer transition-all"
                :class="checkoutStore.state.paymentMethod === 'whatsapp' ? 'border-[#25D366] bg-green-50 ring-1 ring-[#25D366]' : 'border-gray-200 hover:border-gray-300'">
                <input type="radio" name="payment" value="whatsapp" 
                  v-model="checkoutStore.state.paymentMethod"
                  class="mt-1 w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300">
                <div class="flex-1">
                  <span class="font-bold block mb-1">🟢 Commander via WhatsApp</span>
                  <p class="text-sm text-gray-600">
                    Finalisez votre commande avec un conseiller BYLIN : questions, accompagnement,
                    paiement Mobile Money manuel ou sur-mesure. Un message pré-rempli avec votre
                    récapitulatif s'ouvrira dans WhatsApp.
                  </p>
                </div>
              </label>

              <!-- FedaPay — Cahier des charges §9 : Option 2 -->
              <label class="flex items-start gap-4 p-6 border rounded-xl cursor-pointer transition-all"
                :class="checkoutStore.state.paymentMethod === 'fedapay' ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500' : 'border-gray-200 hover:border-gray-300'">
                <input type="radio" name="payment" value="fedapay" 
                  v-model="checkoutStore.state.paymentMethod"
                  class="mt-1 w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300">
                <div class="flex-1">
                  <div class="flex justify-between items-center mb-1">
                    <span class="font-bold">🔵 Payer maintenant — FedaPay (Mobile Money / Carte)</span>
                    <div class="flex gap-2">
                      <img src="https://fedapay.com/img/brand/logo_icon.svg" class="h-6 w-auto" title="FedaPay">
                    </div>
                  </div>
                  <p class="text-sm text-gray-600">
                    Paiement sécurisé par Moov Money, MTN Mobile Money ou Carte Bancaire.
                  </p>
                </div>
              </label>
            </div>

            <div class="mt-8 flex justify-between items-center pt-6 border-t border-gray-100">
              <NuxtLink to="/checkout" class="text-sm text-gray-500 hover:text-black flex items-center gap-2">
                <UIcon name="i-heroicons-arrow-left" />
                Retour
              </NuxtLink>
              <UButton @click="processPayment" :loading="processing" size="lg"
                :color="isWhatsapp ? 'success' : 'primary'" class="px-8">
                <template v-if="isWhatsapp">
                  Envoyer sur WhatsApp
                  <UIcon name="i-heroicons-chat-bubble-left-right" class="ml-2" />
                </template>
                <template v-else>
                  Payer {{ formatPrice(cartStore.total) }}
                  <UIcon name="i-heroicons-lock-closed" class="ml-2" />
                </template>
              </UButton>
            </div>
          </div>
        </div>

        <!-- Summary -->
        <div class="lg:col-span-1">
          <div class="bg-gray-50 rounded-2xl p-6 sticky top-24">
            <h3 class="font-bold text-lg mb-4">Récapitulatif</h3>
            
            <div class="space-y-3 pb-6 border-b border-gray-200 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Adresse de livraison</span>
                <NuxtLink to="/checkout" class="text-primary-600 hover:underline">Modifier</NuxtLink>
              </div>
              <p class="font-medium text-gray-800">
                {{ checkoutStore.state.shippingAddress.first_name }} {{ checkoutStore.state.shippingAddress.last_name }}<br>
                {{ checkoutStore.state.shippingAddress.address_line1 }}<br>
                {{ checkoutStore.state.shippingAddress.city }}<br>
                {{ checkoutStore.state.shippingAddress.phone }}
              </p>
            </div>

            <div class="py-4 border-b border-gray-200">
               <div v-for="item in cartStore.items" :key="item.id" class="flex gap-4 mb-4 last:mb-0">
                <div class="w-12 h-12 bg-white rounded border border-gray-200 flex-shrink-0 overflow-hidden">
                   <img :src="item.product.media?.[0]?.original_url" class="w-full h-full object-cover">
                </div>
                <div class="flex-1 text-sm">
                  <div class="flex justify-between">
                    <span class="font-medium truncate pr-2">{{ item.product.name }}</span>
                    <span class="font-bold">{{ formatPrice(item.subtotal) }}</span>
                  </div>
                  <span class="text-gray-500 text-xs">x{{ item.quantity }}</span>
                </div>
              </div>
            </div>

            <div class="pt-4 space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Sous-total</span>
                <span>{{ formatPrice(cartStore.subtotal) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Livraison</span>
                <span v-if="cartStore.shipping === 0" class="text-green-600 font-medium">Gratuite</span>
                <span v-else>{{ formatPrice(cartStore.shipping) }}</span>
              </div>
              <div v-if="cartStore.discount > 0" class="flex justify-between text-sm text-green-600">
                <span>Réduction{{ cartStore.couponCode ? ` (${cartStore.couponCode})` : '' }}</span>
                <span>-{{ formatPrice(cartStore.discount) }}</span>
              </div>
              <div class="flex justify-between text-lg font-bold pt-2 border-t border-gray-200 mt-2">
                <span>Total</span>
                <span>{{ formatPrice(cartStore.total) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Order } from '~/types/order'

const checkoutStore = useCheckoutStore()
const cartStore = useCartStore()
const orderStore = useOrderStore()
const router = useRouter()
const toast = useToast()

const processing = ref(false)

const isWhatsapp = computed(() => checkoutStore.state.paymentMethod === 'whatsapp')

// Redirect if step 1 not valid + preselect WhatsApp if the customer
// came from the green cart button (cahier §9)
onMounted(() => {
  if (!checkoutStore.validateShippingStep()) {
    router.push('/checkout')
    return
  }
  if (checkoutStore.channel === 'whatsapp') {
    checkoutStore.setPaymentMethod('whatsapp')
  }
})

const processPayment = async () => {
  processing.value = true
  try {
    const whatsapp = isWhatsapp.value

    const payload = {
      shipping_address: checkoutStore.state.shippingAddress,
      billing_address: checkoutStore.state.useBillingAsShipping ? checkoutStore.state.shippingAddress : checkoutStore.state.billingAddress,
      channel: whatsapp ? 'whatsapp' : 'online',
      payment_method: whatsapp ? 'whatsapp' : checkoutStore.state.paymentMethod,
      customer_email: checkoutStore.state.shippingAddress.email,
      customer_phone: checkoutStore.state.shippingAddress.phone,
      customer_note: checkoutStore.state.customerNote
    }

    const response = await orderStore.createOrder(payload)
    const order: any = response.data

    // Le backend a déjà vidé le panier serveur lors de la création
    // de la commande : on ne vide que l'état local.
    await cartStore.clear({ skipBackend: true })
    checkoutStore.reset()

    if (whatsapp && order?.metadata?.whatsapp_url) {
      // Cahier §9 : ouvre WhatsApp avec le message pré-rempli
      window.open(order.metadata.whatsapp_url, '_blank')
      await router.push({ path: '/checkout/success', query: { channel: 'whatsapp', order: order.order_number } })
    } else if (!whatsapp && order?.payment_url) {
      // Redirection FedaPay
      window.location.href = order.payment_url
    } else if (!whatsapp && order?.metadata?.payment_url) {
      window.location.href = order.metadata.payment_url
    } else {
      await router.push({ path: '/checkout/success', query: order?.order_number ? { order: order.order_number } : {} })
    }

  } catch (error: any) {
    console.error('Payment processing error:', error)
    toast.add({
      title: 'Erreur',
      description: error.response?._data?.message || 'Une erreur est survenue lors de la commande',
      color: 'error'
    })
  } finally {
    processing.value = false
  }
}

useHead({
  title: 'Paiement - Checkout - Bylin'
})
</script>
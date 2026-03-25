<template>
  <div class="min-h-screen bg-[#FAFAFA] font-sans">
    <!-- Hero Section -->
    <section
      class="relative h-[200px] md:h-[280px] bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] overflow-hidden text-white">
      <div class="absolute inset-0 flex flex-col justify-center px-8 md:px-16 z-10">
        <h1 class="text-3xl md:text-5xl font-light mb-3 font-syne">Mon Panier</h1>
        <p class="text-lg opacity-80 font-light">
          {{ cartStore.itemCount }} article{{ cartStore.itemCount > 1 ? 's' : '' }} dans votre panier
        </p>
      </div>
      <div class="absolute top-0 right-0 w-1/2 h-full bg-[url('/images/pattern.svg')] opacity-5 pointer-events-none"></div>
    </section>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Breadcrumb -->
      <nav class="flex text-sm text-gray-500 mb-8" aria-label="Breadcrumb">
        <ol class="flex items-center space-x-2">
          <li><NuxtLink to="/" class="hover:text-black transition-colors">Accueil</NuxtLink></li>
          <li><span class="text-gray-300">/</span></li>
          <li class="font-medium text-black">Panier</li>
        </ol>
      </nav>

      <!-- Empty Cart State -->
      <div v-if="cartStore.items.length === 0" class="text-center py-20">
        <div class="mb-6 mx-auto w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center">
          <Icon name="heroicons:shopping-bag" class="w-16 h-16 text-gray-300" />
        </div>
        <h2 class="text-2xl font-bold text-gray-900 mb-3 font-syne">Votre panier est vide</h2>
        <p class="text-gray-500 mb-8 max-w-md mx-auto">
          Explorez notre collection et ajoutez vos articles préférés à votre panier.
        </p>
        <NuxtLink to="/products"
          class="inline-flex items-center gap-2 px-8 py-4 bg-black text-white rounded-lg text-sm font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors">
          <Icon name="heroicons:arrow-left" class="w-4 h-4" />
          Continuer mes achats
        </NuxtLink>
      </div>

      <!-- Cart with Items -->
      <div v-else class="grid lg:grid-cols-3 gap-12">
        <!-- Cart Items Column -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Header -->
          <div class="flex items-center justify-between pb-4 border-b border-gray-200">
            <h2 class="text-xl font-bold font-syne">Articles ({{ cartStore.itemCount }})</h2>
            <button 
              @click="confirmClearCart"
              class="text-sm text-gray-500 hover:text-red-600 transition-colors flex items-center gap-1">
              <Icon name="heroicons:trash" class="w-4 h-4" />
              Vider le panier
            </button>
          </div>

          <!-- Cart Items -->
          <div class="space-y-4">
            <CartItem 
              v-for="item in cartStore.items" 
              :key="item.id" 
              :item="item"
            />
          </div>

          <!-- Continue Shopping Link -->
          <NuxtLink 
            to="/products" 
            class="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors mt-4">
            <Icon name="heroicons:arrow-left" class="w-4 h-4" />
            Continuer mes achats
          </NuxtLink>
        </div>

        <!-- Order Summary Column -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <h3 class="text-lg font-bold font-syne mb-6">Récapitulatif</h3>
            
            <!-- Promo Code -->
            <div class="mb-6">
              <label class="text-sm text-gray-600 mb-2 block">Code promo</label>
              <div class="flex gap-2">
                <input 
                  v-model="promoCode"
                  type="text" 
                  placeholder="Entrer le code"
                  class="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black transition-colors"
                />
                <button 
                  @click="applyPromoCode"
                  class="px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-black transition-colors">
                  Appliquer
                </button>
              </div>
            </div>

            <!-- Totals -->
            <div class="space-y-3 py-4 border-t border-gray-100">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Sous-total</span>
                <span class="font-medium">{{ formatPrice(cartStore.subtotal) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Livraison</span>
                <span v-if="cartStore.shipping === 0" class="text-green-600 font-medium">Gratuite</span>
                <span v-else class="font-medium">{{ formatPrice(cartStore.shipping) }}</span>
              </div>
              <div v-if="cartStore.discount > 0" class="flex justify-between text-sm text-green-600">
                <span>Réduction</span>
                <span class="font-medium">-{{ formatPrice(cartStore.discount) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">TVA (18%)</span>
                <span class="font-medium">{{ formatPrice(cartStore.tax) }}</span>
              </div>
            </div>

            <!-- Total -->
            <div class="flex justify-between items-center py-4 border-t border-gray-200">
              <span class="text-lg font-bold">Total</span>
              <span class="text-2xl font-bold font-syne">{{ formatPrice(cartStore.total) }}</span>
            </div>

            <!-- Free Shipping Progress -->
            <div v-if="cartStore.subtotal < 100000" class="mb-6 p-4 bg-amber-50 rounded-lg">
              <div class="flex items-center gap-2 text-sm text-amber-800 mb-2">
                <Icon name="heroicons:truck" class="w-4 h-4" />
                <span>Plus que <strong>{{ formatPrice(100000 - cartStore.subtotal) }}</strong> pour la livraison gratuite</span>
              </div>
              <div class="w-full bg-amber-200 rounded-full h-1.5">
                <div 
                  class="bg-amber-500 h-1.5 rounded-full transition-all duration-500"
                  :style="{ width: `${Math.min((cartStore.subtotal / 100000) * 100, 100)}%` }"
                ></div>
              </div>
            </div>
            <div v-else class="mb-6 p-4 bg-green-50 rounded-lg flex items-center gap-2 text-sm text-green-700">
              <Icon name="heroicons:check-circle" class="w-5 h-5" />
              <span>Vous bénéficiez de la <strong>livraison gratuite</strong> !</span>
            </div>

            <!-- Checkout Button -->
            <NuxtLink 
              to="/checkout"
              class="w-full flex items-center justify-center gap-2 py-4 bg-black text-white text-sm font-bold uppercase tracking-wider rounded-lg hover:bg-gray-800 transition-all duration-200 hover:shadow-lg">
              <span>Passer commande</span>
              <Icon name="heroicons:arrow-right" class="w-4 h-4" />
            </NuxtLink>

            <!-- Trust Badges -->
            <div class="mt-6 pt-6 border-t border-gray-100">
              <div class="grid grid-cols-2 gap-4 text-center">
                <div class="flex flex-col items-center gap-1">
                  <Icon name="heroicons:shield-check" class="w-6 h-6 text-gray-400" />
                  <span class="text-xs text-gray-500">Paiement sécurisé</span>
                </div>
                <div class="flex flex-col items-center gap-1">
                  <Icon name="heroicons:truck" class="w-6 h-6 text-gray-400" />
                  <span class="text-xs text-gray-500">Livraison rapide</span>
                </div>
                <div class="flex flex-col items-center gap-1">
                  <Icon name="heroicons:arrow-path" class="w-6 h-6 text-gray-400" />
                  <span class="text-xs text-gray-500">Retours faciles</span>
                </div>
                <div class="flex flex-col items-center gap-1">
                  <Icon name="heroicons:phone" class="w-6 h-6 text-gray-400" />
                  <span class="text-xs text-gray-500">Support 24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Clear Cart Confirmation Modal -->
    <UModal v-model:open="showClearConfirm">
      <template #content>
        <div class="p-6 text-center">
          <div class="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <Icon name="heroicons:exclamation-triangle" class="w-8 h-8 text-red-600" />
          </div>
          <h3 class="text-lg font-bold mb-2">Vider le panier ?</h3>
          <p class="text-gray-500 mb-6">Cette action supprimera tous les articles de votre panier.</p>
          <div class="flex gap-3">
            <UButton 
              color="neutral" 
              variant="outline" 
              class="flex-1" 
              @click="showClearConfirm = false">
              Annuler
            </UButton>
            <UButton 
              color="error" 
              class="flex-1" 
              @click="clearCart">
              Vider le panier
            </UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import CartItem from '~/components/cart/CartItem.vue'

const cartStore = useCartStore()
const toast = useToast()

// State
const promoCode = ref('')
const showClearConfirm = ref(false)

// Methods
const confirmClearCart = () => {
  showClearConfirm.value = true
}

const clearCart = () => {
  cartStore.clear()
  showClearConfirm.value = false
  toast.add({
    title: 'Panier vidé',
    description: 'Tous les articles ont été retirés de votre panier',
    icon: 'i-heroicons-trash',
    color: 'neutral'
  })
}

const applyPromoCode = () => {
  if (!promoCode.value.trim()) {
    toast.add({
      title: 'Code requis',
      description: 'Veuillez entrer un code promo',
      icon: 'i-heroicons-exclamation-circle',
      color: 'warning'
    })
    return
  }
  
  // TODO: Implement promo code logic via API
  toast.add({
    title: 'Code non valide',
    description: 'Ce code promo n\'est pas valide ou a expiré',
    icon: 'i-heroicons-x-circle',
    color: 'error'
  })
}

// SEO
useHead({
  title: 'Mon Panier - Bylin',
  meta: [
    { name: 'description', content: 'Consultez et gérez les articles de votre panier.' }
  ]
})
</script>

<style scoped>
.font-syne { font-family: 'Syne', sans-serif; }
</style>
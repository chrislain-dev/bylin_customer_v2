<template>
  <div class="min-h-screen bg-[#FAFAFA] py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Stepper -->
      <div class="flex items-center justify-center mb-12">
        <div class="flex items-center">
          <div class="flex flex-col items-center">
            <div class="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold">1</div>
            <span class="text-sm font-medium mt-2">Livraison</span>
          </div>
          <div class="w-24 h-0.5 bg-gray-200 mx-4"></div>
          <div class="flex flex-col items-center opacity-50">
            <div class="w-10 h-10 bg-white border-2 border-gray-200 text-gray-400 rounded-full flex items-center justify-center font-bold">2</div>
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
        <!-- Formulaire -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 class="text-2xl font-bold font-syne mb-6">Adresse de livraison</h2>
            
            <form @submit.prevent="nextStep" class="space-y-6">
              <div class="grid md:grid-cols-2 gap-6">
                <UFormField label="Prénom" required>
                  <UInput v-model="checkoutStore.state.shippingAddress.first_name" size="lg" placeholder="Votre prénom" />
                </UFormField>
                <UFormField label="Nom" required>
                  <UInput v-model="checkoutStore.state.shippingAddress.last_name" size="lg" placeholder="Votre nom" />
                </UFormField>
              </div>

              <div class="grid md:grid-cols-2 gap-6">
                <UFormField label="Email" required>
                  <UInput v-model="checkoutStore.state.shippingAddress.email" type="email" size="lg" placeholder="email@exemple.com" />
                </UFormField>
                <UFormField label="Téléphone" required>
                  <UInput v-model="checkoutStore.state.shippingAddress.phone" size="lg" placeholder="+229 ..." />
                </UFormField>
              </div>

              <UFormField label="Adresse" required>
                <UInput v-model="checkoutStore.state.shippingAddress.address_line1" size="lg" placeholder="Quartier, Rue, Maison..." />
              </UFormField>

              <div class="grid md:grid-cols-2 gap-6">
                <UFormField label="Ville" required>
                  <USelect v-model="checkoutStore.state.shippingAddress.city" :options="cities" size="lg" />
                </UFormField>
                <UFormField label="Pays" required>
                  <UInput v-model="checkoutStore.state.shippingAddress.country" disabled size="lg" />
                </UFormField>
              </div>

              <div class="pt-6 border-t border-gray-100 flex justify-between items-center">
                <NuxtLink to="/cart" class="text-sm text-gray-500 hover:text-black flex items-center gap-2">
                  <UIcon name="i-heroicons-arrow-left" />
                  Retour au panier
                </NuxtLink>
                <UButton type="submit" color="primary" size="lg" :disabled="!isValid">
                  Continuer vers le paiement
                  <UIcon name="i-heroicons-arrow-right" class="ml-2" />
                </UButton>
              </div>
            </form>
          </div>
        </div>

        <!-- Récapitulatif -->
        <div class="lg:col-span-1">
          <div class="bg-gray-50 rounded-2xl p-6 sticky top-24">
            <h3 class="font-bold text-lg mb-4">Récapitulatif</h3>
            <div class="space-y-4 mb-6">
              <div v-for="item in cartStore.items" :key="item.id" class="flex gap-4">
                <div class="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                  <img :src="item.product.media?.[0]?.original_url" class="w-full h-full object-cover">
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium truncate">{{ item.product.name }}</p>
                  <p class="text-xs text-gray-500">Qté: {{ item.quantity }}</p>
                  <p class="text-sm font-bold mt-1">{{ formatPrice(item.subtotal) }}</p>
                </div>
              </div>
            </div>
            
            <div class="border-t border-gray-200 pt-4 space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Sous-total</span>
                <span>{{ formatPrice(cartStore.subtotal) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Livraison</span>
                <span>Calculé à l'étape suivante</span>
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
const checkoutStore = useCheckoutStore()
const cartStore = useCartStore()
const router = useRouter()

const cities = ['Cotonou', 'Porto-Novo', 'Abomey-Calavi', 'Parakou', 'Ouidah', 'Bohicon']

const isValid = computed(() => checkoutStore.validateShippingStep())

const nextStep = () => {
  if (isValid.value) {
    router.push('/checkout/payment')
  }
}

useHead({
  title: 'Livraison - Checkout - Bylin'
})
</script>
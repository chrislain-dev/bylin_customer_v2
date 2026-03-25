<script setup lang="ts">
const cartStore = useCartStore()
const router = useRouter()

const goToCheckout = async () => {
  cartStore.drawerOpen = false
  await router.push('/checkout')
}
</script>

<template>
      <USlideover 
            v-model:open="cartStore.drawerOpen" 
            title="Mon panier" 
            description="Contenu de votre panier" 
            side="right"
            :ui="{ 
                  content: 'w-full sm:w-[500px] md:w-[600px] max-w-2xl',
                  body: 'flex-1 overflow-y-auto p-0',
                  footer: 'border-t p-0'
            }"
      >
            <!-- Trigger -->
            <template #default>
                  <div class="relative inline-block">
                        <UButton icon="i-heroicons-shopping-bag" color="neutral" variant="ghost" class="text-white hover:text-black" />
                        <span v-if="cartStore.itemCount > 0" class="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-red-600 text-white text-[10px] font-bold rounded-full pointer-events-none">
                              {{ cartStore.itemCount }}
                        </span>
                  </div>
            </template>

            <template #body>
                  <!-- Cart Items -->
                  <div v-if="cartStore.items.length > 0" class="space-y-2 px-6 py-4">
                        <AppHeaderCartItem v-for="item in cartStore.items" :key="item.id" :item="item" />
                  </div>

                  <!-- Empty State -->
                  <div v-else class="flex flex-col items-center justify-center py-12 px-4">
                        <div class="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                              <UIcon name="i-heroicons-shopping-bag" class="w-10 h-10 text-gray-400" />
                        </div>
                        <p class="text-gray-500 dark:text-gray-400 text-center">
                              Votre panier est vide
                        </p>
                  </div>
            </template>

            <template #footer v-if="cartStore.items.length > 0">
                  <div class="w-full px-6 py-4 space-y-4 bg-gray-50 dark:bg-gray-900">
                        <div class="flex justify-between items-center">
                              <span class="text-base font-medium">Sous-total</span>
                              <span class="text-xl font-bold">{{ formatPrice(cartStore.subtotal) }}</span>
                        </div>
                        <p class="text-xs text-gray-500 dark:text-gray-400">
                              Frais de livraison calculés à l'étape suivante
                        </p>
                        <UButton color="primary" block size="lg" @click="goToCheckout">
                              Commander
                        </UButton>
                        <UButton color="neutral" variant="outline" block @click="cartStore.drawerOpen = false">
                              Continuer mes achats
                        </UButton>
                  </div>
            </template>
      </USlideover>
</template>
